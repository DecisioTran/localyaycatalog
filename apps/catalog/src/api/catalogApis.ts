import { CatalogItem } from "../store/store";
import wpEndpoint from "./apiUrl";

const CatalogApis = {
  get: (): Promise<Array<CatalogItem>> => {
    return wpEndpoint.get("get_catalogs").json();
  },
  getOne: (id: number): Promise<CatalogItem> => {
    return wpEndpoint.get(`get/${id}`).json();
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edit: (id: number, data: any): Promise<string> => {
    return wpEndpoint
      .put(`edit/${id}`, {
        json: data,
      })
      .json();
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add: (data: any): Promise<string> => {
    return wpEndpoint
      .post("add", {
        json: data,
      })
      .json();
  },
  delete: (id: number): Promise<string> => {
    return wpEndpoint.delete(`delete/${id}`).json();
  },
};

export default CatalogApis;
