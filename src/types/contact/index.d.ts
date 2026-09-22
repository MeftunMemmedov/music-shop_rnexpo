export type ContactInformation = {
  address: string;
  phone: string;
  email: string;
  map_url: string;
  socials: { title: string; icon: string; url: string }[];
};

export type ContactMessage = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
};
