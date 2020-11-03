import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Card = {
  created_at: number;
  updated_at: number;
  owner: string;
  sender: string;
  card_id: number;
  card_uri: string;
  transaction_hash: string;
}

type DetailData = {
  name: string;
  description: string;
  image: string;
  background_color: string;
  sendable: boolean;
  attributes: { trait_type: string, value: string }[];
}

type PropsType = {
  card: Card;
  confirmSendCard: (to: string) => Promise<any>;
  fetchResultSendCard: () => Promise<boolean>;
}

export default function Card(props: PropsType) {
  const { card, confirmSendCard, fetchResultSendCard } = props;

  const [data, setData] = useState<DetailData | null>(null);
  const [trySend, setTrySend] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get(card.card_uri);
      setData(result.data);
    }

    fetchData();
  }, []);

  async function handleSendCard() {
    const toAddress = window.prompt('To Address');
    if(toAddress == null || !Boolean(toAddress)) return;

    const sendConfirmResult = await confirmSendCard(toAddress);
    if(sendConfirmResult === false) return alert('Failed Send');

    setTrySend(true);
  }

  if(!Boolean(data)) {
    return (
      <div className={'card'}>
        <p>fetching data...</p>
      </div>
    );
  }

  return (
    <div className={'card'}>
      <p>{data?.name}</p>
      <img src={data?.image} style={{ backgroundColor: data?.background_color }} />
      <p className={'description'}>{data?.description}</p>
      <div className={'attributes'}>
        {data?.attributes.map(({ trait_type, value }) => <p>[{trait_type}] {value}</p>)}
      </div>

      {!trySend && <button onClick={handleSendCard}>Confirm Send</button>}
      {trySend && <button onClick={fetchResultSendCard}>Check Send Result</button>}
    </div>
  );
}