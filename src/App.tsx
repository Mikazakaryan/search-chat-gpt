import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { GPT_AUTHORIZE_URL, GPT_LOG_IN_URL } from "./defenitions";
import Input from "./Input";

import "./app.css";
import { GPTConversation } from "./chat";

function App() {
  const [accessToken, setAccessToken] = useState();
  // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJtaWNoYWVsemFrYXJ5YW45NEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VvaXBfY291bnRyeSI6IlVTIn0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1mODVraEhmbUx4anRtN2hDSzRjODhqcEkifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTE1MzYyMTEwNTUxMDQxNTM5NzE2IiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjcwNzU2NTU3LCJleHAiOjE2NzA3OTk3NTcsImF6cCI6IlRkSkljYmUxNldvVEh0Tjk1bnl5d2g1RTR5T282SXRHIiwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSBtb2RlbC5yZWFkIG1vZGVsLnJlcXVlc3Qgb3JnYW5pemF0aW9uLnJlYWQgb2ZmbGluZV9hY2Nlc3MifQ.FJYviJ5vCCEkwSZzmXuYAjGlnQX4Y3lbnJTfu1C3iSsxc9ovmSrZMZr4eBaw0R-OtFAoxv-0z2QjDhcV1BZr4ElyyEZS9zpjiJ57T0U_f23E3CCmSWs8x--aq3q_GqoQ6X9gl1C5GBo0Pg3szNbrtUT6GrKFow4tAVhX3tTz6vpWr-3_3K-6BusIt0KLqk6ggs5tkXXxYzR7cFnhYGiaa0pmZEfUz_0xXXT_nqLEUrCByqYXoHE5wuKS5KTdYyGWQHaiYC9bEw2u_b8yoPXTPIAsLS53oF1d4We41CAyGUuJJUh2gmlldD1qnjzIQZyxRIApDWvNhs1YhVRwV6UVFg"
  const [result, setResult] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      return;
    }

    const interval = setInterval(() => {
      chrome.storage.local.get(["GPT-accessToken"], (items: any) => {
        const _accessToken = items["GPT-accessToken"];
        setAccessToken(_accessToken);
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && searchTerm) {
      setIsLoading(true);
      GPTConversation(accessToken, searchTerm, (value) => {
        setIsLoading(false);
        setResult(value);
      });
    }
  }, [searchTerm, accessToken]);

  return (
    <>
      {!accessToken ? (
        <div className="container orange-text">
          <span>{"First you need to log in with "}</span>
          <a href={GPT_LOG_IN_URL} target="_blank" rel="noreferrer">
            OpenAi
          </a>
          <span>{", then "}</span>
          <a href={GPT_AUTHORIZE_URL} target="_blank" rel="noreferrer">
            athorize
          </a>
        </div>
      ) : (
        <div className="container">
          <Input setValue={setSearchTerm} />
          {(result || isLoading) && (
            <div className="container content">
              {isLoading && (
                <div className="loader-wrapper">
                  <div className="loader" />
                </div>
              )}
              {result && <ReactMarkdown>{result}</ReactMarkdown>}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
