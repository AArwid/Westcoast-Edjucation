import { HttpClient } from "./httpClient";


describe("HttpClient", () => {
  const client = new HttpClient();

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it("appends base URL when passed a relative path and returns parsed JSON", async () => {
    const fakeData = { foo: "bar" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => fakeData,
    });

    const result = await client.get<{ foo: string }>("/test");
    expect(result).toEqual(fakeData);
    expect(global.fetch as jest.Mock).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
    );
  });

  it("throws when response.ok is false", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(client.get("/missing")).rejects.toThrow("404");
  });
});
