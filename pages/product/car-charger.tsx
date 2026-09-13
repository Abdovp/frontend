import CarChargerPage from '../../components/car-charger/CarChargerPage';
import { getProduct } from '../../lib/products';

export default function CarCharger() {
  return <CarChargerPage product={getProduct('car-charger')} />;
}
