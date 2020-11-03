import React, { useEffect, useState } from 'react';
import { prepare, request, getResult, getCardList } from 'klip-sdk';
import axios from 'axios';

import './App.css';

import Card from './Card';

const ON_LOG_SERVER = false;

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
  name: string;
  symbol_img: string;
  cards: Card[];
}

export default function App() {
  const [requests, setRequests] = useState<RequestStorage>(DEFAULT_REQUEST_STORAGE);
  const [userAddress, setUserAddress] = useState<string>('');
  const [serviceInfos, setServiceInfos] = useState<ServiceInfo[]>([]);

  useEffect(() => {
    if(Boolean(userAddress)) getCards();
  }, [userAddress]);

  async function requestAuth() {
    const resultAuth = await prepare.auth({ bappName: 'Test BApp' });
    log(resultAuth);

    request(resultAuth.request_key, null);
    setRequests({ ...requests, auth: resultAuth.request_key });
  }
  
  async function fetchAuth() {
    try {
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

      newInfos.push(newInfo);
    }

    setServiceInfos(newInfos);
  }

  return (
    <div className={'App'}>
      <h2>Klip SDK</h2>
      <h5>My Klip Address: {userAddress}</h5>
      <div>

        {/* not logined */}
        {!Boolean(userAddress) && (
          <>
            {/* Request Klip Login */}
            {!Boolean(requests.auth) && (
              <div className={'section'}>
                <button onClick={requestAuth}>Request Klip Login</button>
              </div>
            )}

            {/* Check Login Respones */}
            {Boolean(requests.auth) && (
              <div className={'section'}>
                <button onClick={fetchAuth}>Success Login</button>
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
                      <Card key={`${info.name}:${card.card_id}`} card={card} />
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