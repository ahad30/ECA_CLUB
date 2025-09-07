import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubAPI, eprAPI, memberAPI, userAPI } from '../services/api';

//user hooks

export const useUser = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userAPI.getUsers();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};




// Clubs hooks
export const useClubs = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await clubAPI.getClubs();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateClub = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clubAPI.createClub,
    onSuccess: () => {
      // Invalidate and refetch clubs query after successful creation
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
};

export const useUpdateClub = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => clubAPI.updateClub(id, data),
    onSuccess: () => {
      // Invalidate and automatically refetch clubs query after successful update
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
};

export const useDeleteClub = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clubAPI.deleteClub,
    onSuccess: () => {
      // Invalidate and automatically refetch clubs query after successful deletion
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
};

// Members hooks
export const useMembers = (filters = {}) => {
  return useQuery({
    queryKey: ['members', filters],
    queryFn: async () => {
      const params = {};
      if (filters.club) params.club = filters.club;
      if (filters.class_std) params.class_std = filters.class_std;
      if (filters.section) params.section = filters.section;

      const response = await memberAPI.getMembers(params);
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for filtered queries
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: memberAPI.createMember,
    onSuccess: () => {
      // Invalidate members queries after successful creation
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => memberAPI.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: memberAPI.deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useClubStats = (clubId) => {
  return useQuery({
    queryKey: ['clubStats', clubId],
    queryFn: async () => {
      if (!clubId) return null;
      const response = await memberAPI.getClubStats(clubId);
      return response.data.data;
    },
    enabled: !!clubId, // Only fetch if clubId is provided
    staleTime: 2 * 60 * 1000,
  });
};

// EPR Data hooks (external APIs - cache longer)
export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await eprAPI.getClasses();
      return response?.data?.message;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (external data changes less frequently)
  });
};

export const useSections = () => {
  return useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const response = await eprAPI.getSections();
      return response?.data?.message;
    },
    staleTime: 30 * 60 * 1000,
  });
};

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await eprAPI.getStudents();
      return response?.data?.message;
    },
    staleTime: 30 * 60 * 1000,
  });
};

