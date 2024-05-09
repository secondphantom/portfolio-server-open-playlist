export type ResponseAnnouncementGetById = {
  id: number;
  title: string;
  content: string;
  isDisplayedOn: boolean;
  displayStartDate: Date;
  displayEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
  admin: {
    id: number;
    profileName: string;
  };
};

export type ResponseAnnouncementGetListByQuery = {
  announcements: {
    id: number;
    title: string;
    createdAt: Date;
    isDisplayedOn: boolean;
    admin: {
      id: number;
      profileName: string;
    };
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseAnnouncementGetIsDisplayedOn = {
  id: number;
  title: string;
  createdAt: Date;
  isDisplayedOn: boolean;
  displayStartDate: Date;
  displayEndDate: Date;
  updatedAt: Date;
};
