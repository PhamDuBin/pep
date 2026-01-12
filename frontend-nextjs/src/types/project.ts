// Project related types

export interface Project {
  id: string;
  name: string;
  description?: string;
  isSelected: boolean;
  createdAt?: Date;
}

export interface Tab {
  id: string;
  label: string;
  subLabel: string;
  icon: string;
  isActive: boolean;
  isDisabled: boolean;
}
