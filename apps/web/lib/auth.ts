import { Role } from "@reportwise/shared";

export function getDashboardRoute(role: Role): string {
  if (role === Role.ADMIN || role === Role.SUPER_ADMIN) {
    return "/admin";
  } else if (role === Role.TEACHER) {
    return "/teacher";
  } else {
    return "/student";
  }
}
