export interface Author {
  id: number;
  name: string;
  lastName: string;
  city: string;
  country: {
    es: string;
    en: string;
    pt: string;
  };
  occupation: {
    es: string;
    en: string;
    pt: string;
  };
  email: string;
  social: Array<{
    label: string;
    icon: string;
    link: string | null;
  }>;
  bio: string | null;
  avatar: string;
  website: string | null;
}
