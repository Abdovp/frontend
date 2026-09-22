import type { GetServerSideProps } from 'next';
import PhoneStandCablePage from '../../components/phone-stand-cable/PhoneStandCablePage';
import { getProduct } from '../../lib/products';

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    product: getProduct('car-charger-bundle'),
  },
});

export default function Max240WFoldablePhoneStandDataCablePage({ product }: { product: ReturnType<typeof getProduct> }) {
  return <PhoneStandCablePage product={product} />;
}
