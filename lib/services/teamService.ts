// services/teamService.ts

import { Scale, Crown, Sparkle, LucideIcon } from "lucide-react";

// ----------------------------------------
// 🔹 Types
// ----------------------------------------

export type Role = "owner" | "administrator" | "moderator";

export interface TeamMember {
  name: string;
  role: Role;
  tag: string;
  avatarUrl: string;
}

// ----------------------------------------
// 🔹 Icon mapping for roles
// ----------------------------------------

export const roleIcons: Record<Role, LucideIcon> = {
  owner: Crown,
  administrator: Sparkle,
  moderator: Scale,
};

// ----------------------------------------
// 🔹 In-memory state (resets on reload)
// ----------------------------------------

let teamMembers: TeamMember[] = [
  {
    name: "swzo",
    role: "owner",
    tag: "@iimillie",
    avatarUrl: "/images/avatars/swzo.png?v=3",
  },
    {
    name: "Pipo",
    role: "owner",
    tag: "@pipo1660",
    avatarUrl: "/images/avatars/pipo.png?v=3",
  },
    {
    name: "DerErneuerer",
    role: "administrator",
    tag: "@dererneuerer",
    avatarUrl: "/images/avatars/dererneuerer.png?v=3",
  },
    {
        name: "Float420",
        role: "administrator",
        tag: "@float420",
        avatarUrl: "/images/avatars/float420.png?v=3",
    },
    {
        name: "Extremely_Moist",
        role: "moderator",
        tag: "@hex_beans",
        avatarUrl: "/images/avatars/extremely_moist.png?v=3",
    }
];

// ----------------------------------------
// 🔹 Cache variable for team members list
// ----------------------------------------

let cachedTeamMembers: TeamMember[] | null = null;

// ----------------------------------------
// 🔹 Service functions with cache mechanism
// ----------------------------------------

export const getTeamMembers = (): TeamMember[] => {
  if (cachedTeamMembers) {
    console.log("[Cache] getTeamMembers: returning cached team members");
    return cachedTeamMembers;
  }
  console.log("[Load] getTeamMembers: loading fresh team members");
  cachedTeamMembers = [...teamMembers];
  return cachedTeamMembers;
};

export const getTeamMemberByName = (name: string): TeamMember | undefined => {
  const allMembers = getTeamMembers();
  return allMembers.find(member => member.name === name);
};

export const addTeamMember = (newMember: TeamMember): void => {
  teamMembers.push(newMember);
  cachedTeamMembers = [...teamMembers];
  console.log(`[Update] addTeamMember: member "${newMember.name}" added, cache updated`);
};

export const updateTeamMember = (updatedMember: TeamMember): void => {
  teamMembers = teamMembers.map(member => (member.name === updatedMember.name ? updatedMember : member));
  cachedTeamMembers = [...teamMembers];
  console.log(`[Update] updateTeamMember: member "${updatedMember.name}" updated, cache updated`);
};

export const deleteTeamMember = (name: string): void => {
  teamMembers = teamMembers.filter(member => member.name !== name);
  cachedTeamMembers = [...teamMembers];
  console.log(`[Update] deleteTeamMember: member "${name}" deleted, cache updated`);
};