export interface IEncryption {
  compare: (password: string, encrypted: string) => Promise<boolean>;
  hashSync: (password: string) => string;
}
