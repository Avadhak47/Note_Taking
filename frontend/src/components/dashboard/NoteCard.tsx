import React from 'react';
import styled from 'styled-components';
import { Edit, Trash2, Pin, PinOff } from 'lucide-react';
import { Card } from '../../styles/GlobalStyles';
import { Note } from '../../types';

const StyledCard = styled(Card)<{ isPinned: boolean }>`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  border-left: 4px solid ${({ isPinned, theme }) => isPinned ? theme.colors.warning : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const NoteTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.4;
  word-break: break-word;
`;

const NoteActions = styled.div`
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  ${StyledCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  padding: 0.375rem;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.text};
  }

  &.pin-active {
    color: ${({ theme }) => theme.colors.warning};
  }

  &.delete:hover {
    background-color: ${({ theme }) => theme.colors.error + '20'};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const NoteContent = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;

const NoteTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary + '20'};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;
`;

const NoteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const PinIndicator = styled.div<{ isPinned: boolean }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: ${({ isPinned, theme }) => isPinned ? theme.colors.warning : 'transparent'};
`;

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onTogglePin }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger edit if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onEdit(note);
  };

  return (
    <StyledCard isPinned={note.isPinned} onClick={handleCardClick}>
      <PinIndicator isPinned={note.isPinned}>
        <Pin size={16} fill="currentColor" />
      </PinIndicator>
      
      <NoteHeader>
        <NoteTitle>{note.title}</NoteTitle>
        <NoteActions>
          <ActionButton
            className={note.isPinned ? 'pin-active' : ''}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note._id);
            }}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            {note.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </ActionButton>
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            title="Edit note"
          >
            <Edit size={16} />
          </ActionButton>
          <ActionButton
            className="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note._id);
            }}
            title="Delete note"
          >
            <Trash2 size={16} />
          </ActionButton>
        </NoteActions>
      </NoteHeader>

      <NoteContent>{note.content}</NoteContent>

      {note.tags.length > 0 && (
        <NoteTags>
          {note.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </NoteTags>
      )}

      <NoteFooter>
        <span>Updated {formatDate(note.updatedAt)}</span>
      </NoteFooter>
    </StyledCard>
  );
};

export default NoteCard;
