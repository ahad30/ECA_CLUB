// context/CommentContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import api from '../services/api';

const CommentContext = createContext();

export const useComments = () => {
  return useContext(CommentContext);
};

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalComments: 0
  });
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      withCredentials: true
    });
    

    // Set up event listeners
    newSocket.on('comment-added', (comment) => {
      console.log('Comment added via socket:', comment);
      setComments(prev => {
        const exists = prev.find(c => c._id === comment._id);
        if (!exists) {
          return [comment, ...prev];
        }
        return prev;
      });
    });
    
    newSocket.on('comment-updated', (comment) => {
      console.log('Comment updated via socket:', comment);
      setComments(prev => prev.map(c => 
        c._id === comment._id ? comment : c
      ));
    });
    
    newSocket.on('comment-deleted', (data) => {
      console.log('Comment deleted via socket:', data);
      setComments(prev => prev.filter(c => c._id !== data._id));
    });
    
    newSocket.on('reaction-updated', (comment) => {
      console.log('Reaction updated via socket:', comment);
      setComments(prev => prev.map(c => 
        c._id === comment._id ? comment : c
      ));
    });
  

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchComments();
    }
  }, [user, pagination.page, sortBy]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/comments?page=${pagination.page}&limit=${pagination.limit}&sortBy=${sortBy}`);
      setComments(res?.data?.comments);
      setPagination(prev => ({
        ...prev,
        totalPages: res.data.totalPages,
        totalComments: res.data.totalComments
      }));
    } catch (error) {
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

const addComment = async (content, parentCommentId = null) => {
  try {
    const res = await api.post('/comments', { content, parentCommentId });
    return { success: true };
  } catch (error) {
    let message = 'Failed to add comment';

    if (error?.response?.data?.errors) {
      message = error.response.data.errors.map(err => err.msg).join(', ');
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }
    setError(message);
    return { success: false, error: message };
  }
};

const updateComment = async (id, content) => {
  try {
    await api.put(`/comments/${id}`, { content });
    return { success: true };
  } catch (error) {
    let message = 'Failed to update comment';

    if (error?.response?.data?.errors) {
      message = error.response.data.errors.map(err => err.msg).join(', ');
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    setError(message);  
    return { success: false, error: message };
  }
};


  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete comment';
      return { success: false, error: message };
    }
  };

  const likeComment = async (id) => {
    try {
      await api.post(`/comments/${id}/like`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to like comment';
      return { success: false, error: message };
    }
  };

  const dislikeComment = async (id) => {
    try {
      await api.post(`/comments/${id}/dislike`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to dislike comment';
      return { success: false, error: message };
    }
  };



  const changePage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const changeSort = (sort) => {
    setSortBy(sort);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const value = {
    comments,
    loading,
    error,
    setError,
    pagination,
    sortBy,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    changePage,
    changeSort,
    fetchComments
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};