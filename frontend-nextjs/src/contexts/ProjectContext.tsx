"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Project } from "@/types";
import { INITIAL_PROJECTS } from "@/mocks";

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  selectProject: (projectId: string) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const selectedProject = projects.find((p) => p.isSelected) || null;

  const selectProject = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        isSelected: p.id === projectId,
      }))
    );
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [...prev, project]);
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        selectProject,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
