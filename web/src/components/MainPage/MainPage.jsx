import Room from "../Room/Room";

const numbers = [
  {
    number: 10,
    has_access: [20, 21, 2],
    features: { conder: true, shtori: true },
    price: "free",
  },
  {
    number: 11,
    has_access: [211, 42, 53],
    features: { conder: true, shtori: true },
    price: "free",
  },
  {
    number: 12,
    has_access: [93, 435, 62],
    features: { conder: true, shtori: true },
    price: "free",
  },
  {
    number: 13,
    has_access: [14, 38, 34],
    features: { conder: true, shtori: true },
    price: "free",
  },
];

export default function MainPage({ pageHandler }) {
  return (
    <>
      {numbers.map(({number, has_access, features, price, clickHandler}) => (
        <Room 
        number={number}
        access={has_access}
        features={features}
        price={price}
        key={number}
        />
      ))}
    </>
  );
}

