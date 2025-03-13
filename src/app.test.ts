import { sequelize } from "./server";
import { main } from "./app";

jest.mock("./server", () => ({
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
  },
}));

describe("Database Connection Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("should log success when the connection is established successfully", async () => {
    // (sequelize.authenticate as jest.Mock).mockResolvedValueOnce(undefined);
    console.log = jest.fn();
    // await main();
    expect(console.log).toHaveBeenCalledWith(
      "Connection has been established successfully."
    );
  });

  it("should throw an error when the connection fails", async () => {
    (sequelize.authenticate as jest.Mock).mockRejectedValueOnce(
      new Error("Unable to connect")
    );
    await expect(main()).rejects.toThrow(
      "Unable to connect to the database: Unable to connect"
    );
  });
});
