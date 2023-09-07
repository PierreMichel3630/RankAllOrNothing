import { MediaType, SortImdb } from "../enum";

export interface Filter {
  page: number;
  withgenres: Array<number>;
  withoutgenres: Array<number>;
  year: Year;
  actors: Array<number>;
  origincountry: Array<string>;
  vote: Vote;
  runtime: Runtime;
  type: MediaType;
  sort: SortImdb;
}

interface Year {
  before: number | undefined;
  after: number | undefined;
  exact: Array<number>;
}

interface Vote {
  under: number | undefined;
  over: number | undefined;
}

interface Runtime {
  under: number | undefined;
  over: number | undefined;
}
