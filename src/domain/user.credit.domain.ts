import { userCredits } from "../schema/schema";

export type UserCreditEntitySelect = typeof userCredits.$inferSelect;
export type UserCreditEntityInsert = typeof userCredits.$inferInsert;

export type RepoCreateUserCreditDto = Pick<
  Required<UserCreditEntitySelect>,
  | "userId"
  | "freeCredits"
  | "purchasedCredits"
  | "freeCreditUpdatedAt"
  | "purchasedCreditUpdatedAt"
>;

export class UserCreditDomain {
  private userId: number;
  private freeCredits: number;
  private purchasedCredits: number;
  private freeCreditUpdatedAt: Date;
  private purchasedCreditUpdatedAt: Date;
  private createdAt?: Date | undefined;
  private updatedAt?: Date | undefined;

  private DEFAULT_FREE_CREDIT = 50;
  private DEFAULT_GET_FREE_CREDIT_EXP_SEC = 24 * 60 * 60;
  private CONSUME_FREE_CREDIT_FOR_CREATE_COURSE = 10;
  private CONSUME_FREE_CREDIT_FOR_CREATE_ENROLL = 20;

  constructor({
    userId,
    freeCredits,
    purchasedCredits,
    freeCreditUpdatedAt,
    purchasedCreditUpdatedAt,
  }: UserCreditEntityInsert) {
    this.userId = userId;
    this.freeCredits =
      freeCredits === undefined ? this.DEFAULT_FREE_CREDIT : freeCredits;
    this.purchasedCredits =
      purchasedCredits === undefined ? 0 : purchasedCredits;
    this.freeCreditUpdatedAt =
      freeCreditUpdatedAt === undefined ? new Date() : freeCreditUpdatedAt;
    this.purchasedCreditUpdatedAt =
      purchasedCreditUpdatedAt === undefined
        ? new Date()
        : purchasedCreditUpdatedAt;
  }

  getCreateUserCreditDto = (): RepoCreateUserCreditDto => {
    return {
      userId: this.userId,
      freeCredits: this.freeCredits,
      purchasedCredits: this.purchasedCredits,
      freeCreditUpdatedAt: this.freeCreditUpdatedAt,
      purchasedCreditUpdatedAt: this.purchasedCreditUpdatedAt,
    };
  };

  getFreeCredit = () => {
    const updatedDate = new Date();
    if (
      updatedDate.getTime() - this.freeCreditUpdatedAt.getTime() <=
      this.DEFAULT_GET_FREE_CREDIT_EXP_SEC * 1000
    ) {
      return { success: false };
    }

    this.freeCredits += this.DEFAULT_FREE_CREDIT;
    this.freeCreditUpdatedAt = updatedDate;
    return { success: true };
  };

  consumeCreditForCreateCourse = () => {
    if (this.freeCredits < this.CONSUME_FREE_CREDIT_FOR_CREATE_COURSE) {
      return { success: false };
    }

    this.freeCredits -= this.CONSUME_FREE_CREDIT_FOR_CREATE_COURSE;

    return { success: true };
  };

  consumeCreditForCreateEnroll = () => {
    if (this.freeCredits < this.CONSUME_FREE_CREDIT_FOR_CREATE_ENROLL) {
      return { success: false };
    }

    this.freeCredits -= this.CONSUME_FREE_CREDIT_FOR_CREATE_ENROLL;

    return { success: true };
  };

  getEntity = () => {
    return {
      userId: this.userId,
      freeCredits: this.freeCredits,
      purchasedCredits: this.purchasedCredits,
      freeCreditUpdatedAt: this.freeCreditUpdatedAt,
      purchasedCreditUpdatedAt: this.purchasedCreditUpdatedAt,
    };
  };
}
