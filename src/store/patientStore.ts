import { create } from 'zustand';
import type { Patient, ViewMode } from '../types';
import { PATIENTS } from '../data/mockData';

interface PatientState {
  patients: Patient[];
  viewMode: ViewMode;
  searchQuery: string;
  statusFilter: string;
  wardFilter: string;
  selectedPatient: Patient | null;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: string) => void;
  setWardFilter: (w: string) => void;
  setSelectedPatient: (p: Patient | null) => void;
  filteredPatients: () => Patient[];
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: PATIENTS,
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'All',
  wardFilter: 'All',
  selectedPatient: null,

  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setWardFilter: (wardFilter) => set({ wardFilter }),
  setSelectedPatient: (selectedPatient) => set({ selectedPatient }),

  filteredPatients: () => {
    const { patients, searchQuery, statusFilter, wardFilter } = get();
    return patients.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchWard = wardFilter === 'All' || p.ward === wardFilter;
      return matchSearch && matchStatus && matchWard;
    });
  },
}));
