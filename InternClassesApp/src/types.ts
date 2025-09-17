export type YogaClass = {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  center: string;
};

export type User = {
  name: string;
  mobile: string;
  credits: number;
  city: string;
  joinedAt: string;
};
