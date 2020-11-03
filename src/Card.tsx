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
  card: Card
}

export default function Card(props: PropsType) {
  const { card } = props;

  const [data, setData] = useState<DetailData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get(card.card_uri);
      setData(result.data);
    }

    fetchData();
  }, []);

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

      <button disabled={true}>send</button>
    </div>
  );
}
