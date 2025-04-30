import { AbstractSession, RestClient, Headers } from "@zowe/imperative";

export class DatasetReader {
  // Mock mode flag
  private static useMockData = false;

  public static async getContent(
    session: AbstractSession,
    dsn: string
  ): Promise<string> {
    // If mock mode is enabled, return sample COBOL code
    if (DatasetReader.useMockData) {
      console.log("Using mock COBOL data for testing");
      return `      * SAMPLE COBOL PROGRAM FOR TESTING
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLOCOB.
       ENVIRONMENT DIVISION.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 HELLO-WORLD PIC X(12) VALUE 'HELLO, WORLD!'.
       PROCEDURE DIVISION.
           DISPLAY HELLO-WORLD.
           STOP RUN.`;
    }

    // Otherwise try to fetch real data
    const encoded = encodeURIComponent(dsn.toUpperCase())
      .replace(/%28/g, "(")
      .replace(/%29/g, ")");

    const url = `/zosmf/restfiles/ds/${encoded}?view=content&encoding=iso8859-1`;
    
    // Try with all possible headers
    const headers: Headers[] = [
      { key: "X-CSRF-ZOSMF-HEADER", value: "true" },
      { key: "X-IBM-Response-Timeout", value: "600" }
    ];
    
    if (session.ISession.user && session.ISession.password) {
      const authString = `${session.ISession.user}:${session.ISession.password}`;
      const base64Auth = Buffer.from(authString).toString("base64");
      headers.push({
        key: "Authorization",
        value: `Basic ${base64Auth}`
      });
    }

    return RestClient.getExpectString(session, url, headers);
  }

  // Method to enable mock mode for testing
  public static enableMockMode() {
    DatasetReader.useMockData = true;
  }
}