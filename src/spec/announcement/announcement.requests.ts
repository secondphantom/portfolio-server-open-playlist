export type RequestAnnouncementGetById = {
  id: number;
};

export type RequestAnnouncementGetListByQuery = {
  order?: "recent" | "old";
  page?: number;
  search?: string;
  isDisplayedOn?: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};
