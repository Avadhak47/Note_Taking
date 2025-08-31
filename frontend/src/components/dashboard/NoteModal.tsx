import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { X, Save, Pin, PinOff, Tag } from 'lucide-react';
import { Button, Input, TextArea, ErrorMessage } from '../../styles/GlobalStyles';
import { Note, NoteFormData } from '../../types';
import { notesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  padding: 0.5rem;
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
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TagChip = styled.span`
  background-color: ${({ theme }) => theme.colors.primary + '20'};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(200, 'Title must be less than 200 characters'),
  content: yup.string().required('Content is required').max(10000, 'Content must be less than 10000 characters'),
});

interface NoteModalProps {
  note?: Note | null;
  onClose: () => void;
  onSave: (note: Note) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Omit<NoteFormData, 'tags' | 'isPinned'>>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
    },
  });

  useEffect(() => {
    if (note) {
      setValue('title', note.title);
      setValue('content', note.content);
      setTags(note.tags);
      setIsPinned(note.isPinned);
    }
  }, [note, setValue]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: Omit<NoteFormData, 'tags' | 'isPinned'>) => {
    setIsLoading(true);
    try {
      const noteData: NoteFormData = {
        ...data,
        tags,
        isPinned,
      };

      let response;
      if (note) {
        response = await notesAPI.updateNote(note._id, noteData);
        toast.success('Note updated successfully');
      } else {
        response = await notesAPI.createNote(noteData);
        toast.success('Note created successfully');
      }

      onSave(response.data.note);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to save note';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <ModalHeader>
          <ModalTitle>{note ? 'Edit Note' : 'Create New Note'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter note title..."
                hasError={!!errors.title}
                {...register('title')}
              />
              {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="content">Content</Label>
              <TextArea
                id="content"
                placeholder="Write your note content here..."
                rows={8}
                hasError={!!errors.content}
                {...register('content')}
              />
              {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                type="text"
                placeholder="Add a tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {tags.length > 0 && (
                <TagsContainer>
                  {tags.map((tag) => (
                    <TagChip key={tag}>
                      <Tag size={12} />
                      {tag}
                      <RemoveTagButton
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X size={12} />
                      </RemoveTagButton>
                    </TagChip>
                  ))}
                </TagsContainer>
              )}
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPinned(!isPinned)}
            >
              {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
              {isPinned ? 'Unpin' : 'Pin Note'}
            </Button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save Note'}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </Overlay>
  );
};

export default NoteModal;
