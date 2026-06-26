export const SYSTEM_PERMISSIONS_MATRIX: Record<string, string[]> = {
  projects: ['view', 'create', 'edit', 'delete', 'archive'],
  tasks: ['view', 'create', 'edit', 'delete', 'assign'],
  members: ['view', 'invite', 'remove', 'update_role'],
  billing: ['view', 'update', 'download_invoices'],
  settings: ['view', 'update']
};

export const RESOURCE_DISPLAY_NAMES: Record<string, string> = {
  projects: 'Projects Management',
  tasks: 'Task Tracking',
  members: 'Team Members',
  billing: 'Billing & Invoices',
  settings: 'System Settings'
};
