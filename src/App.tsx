import React, { useEffect, useState, useRef } from 'react';
import { prepare, request, getResult, getCardList } from 'klip-sdk';
import axios from 'axios';

import './App.css';

import Card from './Card';

const ON_LOG_SERVER = true;

const CONTRACT: { [type in any]: string } = {
  cryptoSwordAndMagic: '0x53571b1eb0c1bed4e06be67e78a1977cc0bd9b74',
  knightStory: '0x08c3c2d9e3738c243d402f6d04e6a351a9f0f6de',
  myCollection: '0x304c85fed0524524f3e2ed04702e69460e7a0873'
}

enum REQUEST {
  auth = 'auth',
  sendKlay = 'sendKlay',
  sendToken = 'sendToken',
  sendCard = 'sendCard',
  executeContract = 'executeContract'
}

type RequestStorage = {
  [type in REQUEST]?: string | null;
}

const DEFAULT_REQUEST_STORAGE: RequestStorage = {
  auth: null,
  sendKlay: null,
  sendToken: null,
  sendCard: null,
  executeContract: null,
};

type Card = {
  created_at: number;
  updated_at: number;
  owner: string;
  sender: string;
  card_id: number;
  card_uri: string;
  transaction_hash: string;
}

type ServiceInfo = {
  contract: string;
  name: string;
  symbol_img: string;
  cards: Card[];
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void | null>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {

    function tick() {
      if (typeof savedCallback?.current !== 'undefined') {
        savedCallback?.current();
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function App() {
  const [requests, setRequests] = useState<RequestStorage>(DEFAULT_REQUEST_STORAGE);
  const [userAddress, setUserAddress] = useState<string>('');
  const [serviceInfos, setServiceInfos] = useState<ServiceInfo[]>([]);

  useInterval(() => {
    fetchResultAuth();
  }, 3000);

  useEffect(() => {
    if(Boolean(userAddress)) getCards();

    window.addEventListener('focus', function() {
      log(`focus`);
      fetchResultAuth();
    });
    window.addEventListener('blur', (e) => log(`blur`));
  }, [userAddress]);

  async function confirmAuth() {
    const resultAuth = await prepare.auth({ bappName: 'Test BApp' });
    log(resultAuth);

    request(resultAuth.request_key, null);
    setRequests({ ...requests, auth: resultAuth.request_key });
  }
  
  async function fetchResultAuth() {
    try {
      log(requests);
      if(!Boolean(requests.auth)) throw 'invalid request';
  
      const result = await getResult(requests.auth);
      log(result);

      if(result.status == 'completed') {
        setUserAddress(result.result.klaytn_address);
        setRequests({ ...requests, auth: null });
      }
    } catch(e) {
      console.error(e);
    }
  }

  async function getCards() {
    const newInfos: ServiceInfo[] = [];
    for(let key in CONTRACT) {
      const newInfo: ServiceInfo & { code: number, err: string } = await getCardList({ contract: CONTRACT[key], eoa: userAddress, cursor: '' });
      if(Boolean(newInfo.err)) continue;

      newInfos.push({...newInfo, contract: CONTRACT[key]});
    }

    setServiceInfos(newInfos);
  }
  
  async function confirmSendCard(bappName: string, from: string, to: string, id: string, contract: string): Promise<boolean> {
    try {
      const res = await prepare.sendCard({ bappName, from, to, id, contract, successLink: '', failLink: '' });
      log(res);

      if(res.err) throw res.err;

      request(res.request_key, null);
      setRequests({ ...requests, sendCard: res.request_key });
      return true;
    } catch(e) {
      console.error(e);
      log(e);
    }

    return false;
  }

  async function fetchResultSendCard() {
    try {
      if(!Boolean(requests.sendCard)) throw 'invalid request';
  
      const result = await getResult(requests.sendCard);
      log(result);

      if(result.status == 'completed') {
        alert('Success Send');
        setRequests({ ...requests, sendCard: null });
        getCards();

        return true;
      }
    } catch(e) {
      console.error(e);
    }

    return false;
  }

  return (
    <div className={'App'}>
      <h2>Klip SDK</h2>
      <h5>My Klip Address: {userAddress}</h5>
      <div>

        {/* not logined */}
        {!Boolean(userAddress) && (
          <>
            {/* Confirm Klip Login */}
            {!Boolean(requests.auth) && (
              <div className={'section'}>
                <button onClick={confirmAuth}>Confirm Klip Login</button>
              </div>
            )}

            {/* Check Login Respones */}
            {Boolean(requests.auth) && (
              <div className={'section'}>
                <button onClick={fetchResultAuth}>Success Login</button>
              </div>
            )}
          </>
        )}

        {/* View User Cards */}
        <div className={'section'}>
          <div>
            <p>- My Cards</p>
            <div>

              {/* Services */}
              {serviceInfos.map((info, i) => (
                <div key={info.name}>

                  {/* Service Title */}
                  <h4 style={{ position: 'sticky', top: 0, left: 0, padding: '20px 0', backgroundColor: '#e9a107', color: '#fff' }}>{info.name}</h4>

                  {/* Cards By Service */}
                  <div>
                    {info.cards.map((card) => (
                      <Card 
                        key={`${info.name}:${card.card_id}`} 
                        card={card}
                        confirmSendCard={(to: string) => confirmSendCard('Test BApp', userAddress, to, String(card.card_id), info.contract)}
                        fetchResultSendCard={fetchResultSendCard}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function log(data: any) {
  if(!ON_LOG_SERVER) return;

  await axios.post('http://172.16.15.20:3005/log', { data: JSON.stringify(data) });
}