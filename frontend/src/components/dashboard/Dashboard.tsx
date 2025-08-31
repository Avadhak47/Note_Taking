import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Search, LogOut, User, Pin } from 'lucide-react';
import { Button, Input } from '../../styles/GlobalStyles';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../types';
import { notesAPI } from '../../services/api';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 0;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    max-width: none;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: space-between;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Avatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.125rem;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [searchTerm]);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes({ search: searchTerm });
      setNotes(response.data.notes);
    } catch (error: any) {
      toast.error('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await notesAPI.deleteNote(noteId);
      setNotes(notes.filter(note => note._id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete note');
    }
  };

  const handleTogglePin = async (noteId: string) => {
    try {
      const response = await notesAPI.togglePin(noteId);
      setNotes(notes.map(note => 
        note._id === noteId ? response.data.note : note
      ));
      toast.success('Note pin status updated');
    } catch (error: any) {
      toast.error('Failed to update note');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleNoteSaved = (savedNote: Note) => {
    if (editingNote) {
      setNotes(notes.map(note => note._id === savedNote._id ? savedNote : note));
    } else {
      setNotes([savedNote, ...notes]);
    }
    handleModalClose();
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const pinnedNotes = notes.filter(note => note.isPinned);
  const regularNotes = notes.filter(note => !note.isPinned);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>📝 Notes App</Logo>
          
          <SearchContainer>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <UserSection>
            <UserInfo>
              <Avatar>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  getUserInitials()
                )}
              </Avatar>
              <span>{user?.firstName} {user?.lastName}</span>
            </UserInfo>
            <Button variant="ghost" onClick={logout}>
              <LogOut size={18} />
              Logout
            </Button>
          </UserSection>
        </HeaderContent>
      </Header>

      <Main>
        <WelcomeSection>
          <WelcomeTitle>Welcome back, {user?.firstName}! 👋</WelcomeTitle>
          <WelcomeSubtitle>
            {notes.length === 0 
              ? "Start organizing your thoughts by creating your first note." 
              : `You have ${notes.length} note${notes.length === 1 ? '' : 's'}.`
            }
          </WelcomeSubtitle>
        </WelcomeSection>

        <ActionsBar>
          <div></div>
          <Button onClick={handleCreateNote}>
            <Plus size={18} />
            New Note
          </Button>
        </ActionsBar>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading notes...</div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pin size={18} />
                  Pinned Notes
                </h3>
                <NotesGrid style={{ marginBottom: '2rem' }}>
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteNote}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </NotesGrid>
              </>
            )}

            {regularNotes.length > 0 && (
              <>
                {pinnedNotes.length > 0 && <h3 style={{ marginBottom: '1rem' }}>Other Notes</h3>}
                <NotesGrid>
                  {regularNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteNote}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </NotesGrid>
              </>
            )}

            {notes.length === 0 && (
              <EmptyState>
                <EmptyStateIcon>📝</EmptyStateIcon>
                <h3>No notes yet</h3>
                <p>Create your first note to get started!</p>
                <Button onClick={handleCreateNote} style={{ marginTop: '1rem' }}>
                  <Plus size={18} />
                  Create Note
                </Button>
              </EmptyState>
            )}
          </>
        )}
      </Main>

      {isModalOpen && (
        <NoteModal
          note={editingNote}
          onClose={handleModalClose}
          onSave={handleNoteSaved}
        />
      )}
    </Container>
  );
};

export default Dashboard;
