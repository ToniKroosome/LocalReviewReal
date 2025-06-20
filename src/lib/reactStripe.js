import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export function loadStripe(pk) {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve(window.Stripe(pk));
    } else {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3';
      script.onload = () => resolve(window.Stripe(pk));
      script.onerror = reject;
      document.body.appendChild(script);
    }
  });
}

const StripeContext = createContext(null);
const ElementsContext = createContext(null);

export function Elements({ stripePromise, children }) {
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  useEffect(() => {
    if (!stripePromise) return;
    stripePromise.then(s => {
      setStripe(s);
      setElements(s.elements());
    });
  }, [stripePromise]);
  return (
    <StripeContext.Provider value={stripe}>
      <ElementsContext.Provider value={elements}>{children}</ElementsContext.Provider>
    </StripeContext.Provider>
  );
}

export const useStripe = () => useContext(StripeContext);
export const useElements = () => useContext(ElementsContext);

export function CardElement({ options }) {
  const elements = useElements();
  const ref = useRef(null);
  useEffect(() => {
    if (!elements || !ref.current) return;
    const card = elements.create('card', options || {});
    card.mount(ref.current);
    return () => card.destroy();
  }, [elements, options]);
  return <div ref={ref} />;
}
