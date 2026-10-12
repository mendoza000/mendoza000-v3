import type { ComponentProps } from "react";
import {
  PiArrowUpRight,
  PiBriefcase,
  PiChatCircle,
  PiDiscordLogo,
  PiEnvelopeSimple,
  PiFileText,
  PiFolderSimple,
  PiGithubLogo,
  PiListChecks,
  PiToolbox,
  PiTwitterLogo,
} from "react-icons/pi";

type IconName =
  | "arrow-up-right"
  | "email"
  | "file-text"
  | "github"
  | "twitter"
  | "discord"
  | "folder"
  | "tools"
  | "contact"
  | "experience"
  | "process";

const icons = {
  "arrow-up-right": PiArrowUpRight,
  email: PiEnvelopeSimple,
  "file-text": PiFileText,
  github: PiGithubLogo,
  twitter: PiTwitterLogo,
  discord: PiDiscordLogo,
  folder: PiFolderSimple,
  tools: PiToolbox,
  contact: PiChatCircle,
  experience: PiBriefcase,
  process: PiListChecks,
} satisfies Record<IconName, typeof PiArrowUpRight>;

type Props = Omit<ComponentProps<typeof PiArrowUpRight>, "aria-hidden" | "focusable"> & {
  name: IconName;
};

export default function PortfolioIcon({ name, ...props }: Props) {
  const Icon = icons[name];
  return <Icon {...props} fill="currentColor" aria-hidden="true" focusable="false" data-interface-icon={name} />;
}
