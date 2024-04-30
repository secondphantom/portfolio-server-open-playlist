export type RequestAnnouncementGetById = {
  id: string;
};

export type RequestAnnouncementGetListByQuery = {
  order?: "recent" | "old";
  page?: number;
  search?: string;
  isDisplayedOn?: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};
