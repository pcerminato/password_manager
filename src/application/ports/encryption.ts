export interface IEncryption {
  compare: (value: string, encrypted: string) => Promise<boolean>;
  hashSync: (value: string) => string;
}
