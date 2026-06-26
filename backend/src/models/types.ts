export interface Permission {
  resource: string;
  action: string;
}

export interface Role {
  id: string; // Unique UUID or system identifier (e.g. role-admin)
  name: string; // Unique, length 3-50, alphanumeric & spaces
  description: string; // Description of the role
  permissions: string[]; // List of permission strings: "resource:action"
  isSystem: boolean; // True for default roles (Owner, Admin, Member, Viewer) which cannot be edited or deleted
}

export interface User {
  id: string; // Unique UUID
  name: string; // Display name
  email: string; // Unique email
  avatarUrl?: string; // Optional avatar image URL
}

export interface UserRole {
  id: string; // Unique assignment ID
  userId: string; // Reference to User.id
  roleId: string; // Reference to Role.id
}
