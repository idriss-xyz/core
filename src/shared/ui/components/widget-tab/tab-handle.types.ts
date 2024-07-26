export interface TabHandleProperties {
  left: number;
  imageSrc?: string;
  name: string;
  isActive: boolean;
  theme: 'bright' | 'dark';
  onClick: () => void;
}
