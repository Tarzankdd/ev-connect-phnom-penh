import {
  Activity,
  BatteryCharging,
  BatteryMedium,
  Bell,
  Bike,
  Bluetooth,
  Bolt,
  CalendarClock,
  Car,
  Check,
  ChevronLeft,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Gift,
  Home,
  Leaf,
  LoaderCircle,
  MapPin,
  MessageSquareWarning,
  Navigation,
  PlugZap,
  QrCode,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Star,
  Store,
  Timer,
  Trophy,
  WalletCards,
  Wrench,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const stations = [
  {
    id: 1,
    name: 'AEON Mall 1 Fast Hub',
    area: 'Tonle Bassac',
    distance: '1.2 km',
    status: 'Available',
    statusColor: 'bg-leaf',
    chargers: 6,
    wait: '0-5 min',
    price: '$0.24',
    swapPrice: '$0.80',
    swapBatteries: 12,
    swapTime: '3 min',
    swap: true,
    reviews: 4.8,
    position: 'left-[58%] top-[46%]',
  },
  {
    id: 2,
    name: 'Riverside EV Point',
    area: 'Sisowath Quay',
    distance: '2.6 km',
    status: 'Busy',
    statusColor: 'bg-amber-400',
    chargers: 2,
    wait: '18 min',
    price: '$0.21',
    swapPrice: null,
    swapBatteries: 0,
    swapTime: null,
    swap: false,
    reviews: 4.5,
    position: 'left-[72%] top-[25%]',
  },
  {
    id: 3,
    name: 'Russian Market Swap',
    area: 'Toul Tom Poung',
    distance: '3.1 km',
    status: 'Available',
    statusColor: 'bg-leaf',
    chargers: 4,
    wait: '8 min',
    price: '$0.19',
    swapPrice: '$0.60',
    swapBatteries: 18,
    swapTime: '2 min',
    swap: true,
    reviews: 4.7,
    position: 'left-[32%] top-[68%]',
  },
  {
    id: 4,
    name: 'Central Market Charge',
    area: 'Daun Penh',
    distance: '2.1 km',
    status: 'Full',
    statusColor: 'bg-red-500',
    chargers: 0,
    wait: '35 min',
    price: '$0.23',
    swapPrice: null,
    swapBatteries: 0,
    swapTime: null,
    swap: false,
    reviews: 4.2,
    position: 'left-[47%] top-[31%]',
  },
];

const filters = ['Fast Charge', 'Battery Swap', 'Cheapest', 'Nearest'];
const timeSlots = ['09:30', '10:00', '10:30', '11:00'];
const chargeTypes = ['Normal', 'Fast', 'Battery Swap'];
const servicePartners = [
  {
    id: 1,
    name: 'PP E-Bike Care',
    type: 'Repair shop',
    distance: '0.9 km',
    service: 'Brake, controller, tire, wiring',
    price: 'from $2',
    icon: Wrench,
  },
  {
    id: 2,
    name: 'Green Moto Electric',
    type: 'Electric bike shop',
    distance: '1.7 km',
    service: 'New bikes, batteries, helmets',
    price: '0% test ride',
    icon: Store,
  },
  {
    id: 3,
    name: 'Toul Tom Poung EV Service',
    type: 'Repair + parts',
    distance: '2.4 km',
    service: 'Battery check, motor diagnosis',
    price: 'from $3',
    icon: Bike,
  },
];
const paymentMethods = [
  {
    id: 'aba',
    label: 'ABA Pay',
    detail: 'Scan to pay',
    icon: Smartphone,
    account: 'kanal.chun@aba',
    balance: '$42.80',
  },
  {
    id: 'card',
    label: 'Visa Card',
    detail: '**** 2849',
    icon: CreditCard,
    account: 'Visa ending 2849',
    balance: 'Verified',
  },
  {
    id: 'wallet',
    label: 'EV Wallet',
    detail: '$18.40 balance',
    icon: WalletCards,
    account: 'EV Connect Wallet',
    balance: '$18.40',
  },
];

function App() {
  const [screen, setScreen] = useState('welcome');
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [serviceMode, setServiceMode] = useState('charge');
  const [reservation, setReservation] = useState({
    time: timeSlots[1],
    type: chargeTypes[1],
    payment: paymentMethods[0].id,
    confirmed: false,
  });
  const [chargePercent, setChargePercent] = useState(68);
  const [reportSent, setReportSent] = useState(false);

  const navigate = (next, options = {}) => {
    if (options.serviceMode) {
      setServiceMode(options.serviceMode);
      if (options.serviceMode === 'swap') {
        setReservation((current) => ({ ...current, type: 'Battery Swap', confirmed: false }));
      }
    }
    setScreen(next);
    if (next !== 'reservation') {
      setReservation((current) => ({ ...current, confirmed: false }));
    }
  };

  const openStation = (station) => {
    setSelectedStation(station);
    navigate('station');
  };

  const changeServiceMode = (mode) => {
    setServiceMode(mode);
    if (mode === 'swap') {
      setReservation((current) => ({ ...current, type: 'Battery Swap', confirmed: false }));
    }
  };

  const screens = {
    welcome: <WelcomeScreen onStart={() => navigate('home')} />,
    home: <HomeScreen station={selectedStation} onNavigate={navigate} onStation={() => navigate('station')} />,
    map: (
      <MapScreen
        stations={stations}
        serviceMode={serviceMode}
        onBack={() => navigate('home')}
        onStation={openStation}
        onModeChange={changeServiceMode}
      />
    ),
    station: (
      <StationDetails
        station={selectedStation}
        serviceMode={serviceMode}
        onBack={() => navigate('map')}
        onReserve={() => navigate('reservation')}
      />
    ),
    reservation: (
      <ReservationScreen
        station={selectedStation}
        reservation={reservation}
        onBack={() => navigate('station')}
        onChange={setReservation}
      />
    ),
    progress: (
      <ChargingProgress
        percent={chargePercent}
        onBack={() => navigate('home')}
        onBump={() => setChargePercent((value) => Math.min(value + 7, 96))}
        onStop={() => navigate('home')}
      />
    ),
    rewards: <RewardsScreen onBack={() => navigate('home')} />,
    service: <ServiceScreen onBack={() => navigate('home')} />,
    report: (
      <CommunityReportScreen
        sent={reportSent}
        onSent={() => setReportSent(true)}
        onBack={() => navigate('home')}
      />
    ),
  };

  return (
    <main className="min-h-screen bg-[#e7eee9] px-4 py-5 text-ink sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-5xl items-center justify-center">
        <div className="relative h-[844px] w-full max-w-[430px] overflow-hidden rounded-[34px] border-[10px] border-[#111815] bg-limewash shadow-soft">
          <div className="absolute left-1/2 top-2 z-40 h-6 w-32 -translate-x-1/2 rounded-full bg-[#111815]" />
          <div className="phone-scroll h-full overflow-y-auto">
            {screens[screen]}
          </div>
          {screen !== 'welcome' && <BottomNav active={screen} onNavigate={navigate} />}
        </div>
      </div>
    </main>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <section className="flex min-h-full flex-col bg-[#f6fbf8] px-6 pb-8 pt-14">
      <div className="flex items-center justify-between">
        <LogoMark />
        <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-leaf shadow-sm">Phnom Penh</div>
      </div>

      <div className="mt-10 overflow-hidden rounded-[28px] bg-ink p-6 text-white shadow-soft">
        <div className="relative h-60 rounded-[22px] bg-[#23362e] p-5">
          <div className="absolute inset-x-8 top-8 h-24 rounded-full border border-white/10" />
          <div className="absolute bottom-8 left-5 right-5 h-12 rounded-full bg-white/10" />
          <div className="absolute left-8 top-20 flex h-24 w-40 items-center justify-center rounded-[28px] bg-leaf shadow-lg">
            <Car size={58} strokeWidth={1.6} />
          </div>
          <div className="absolute right-8 top-12 grid h-16 w-16 place-items-center rounded-2xl bg-white text-leaf shadow-lg">
            <PlugZap size={34} />
          </div>
          <div className="absolute bottom-8 right-7 flex items-center gap-2 rounded-full bg-white px-4 py-3 text-ink">
            <Bolt size={18} className="text-leaf" />
            <span className="text-sm font-bold">82%</span>
          </div>
        </div>
      </div>

      <div className="mt-9">
        <h1 className="text-4xl font-black leading-tight tracking-normal">EV Connect Phnom Penh</h1>
        <p className="mt-3 text-xl font-semibold text-leaf">Charge faster. Drive greener.</p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Reserve chargers, swap batteries, and track cleaner trips around the city.
        </p>
      </div>

      <div className="mt-auto rounded-3xl bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Design Thinking Problem Statement</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          EV users in Phnom Penh need a reliable way to find available charging stations and battery swapping services because limited information creates range anxiety and slows EV adoption.
        </p>
      </div>

      <button
        onClick={onStart}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf py-4 text-base font-bold text-white shadow-lg shadow-green-700/20 transition active:scale-[0.98]"
      >
        Get Started
        <Navigation size={19} />
      </button>
    </section>
  );
}

function HomeScreen({ station, onNavigate, onStation }) {
  const actions = [
    { label: 'Find Station', icon: Search, screen: 'map', serviceMode: 'charge' },
    { label: 'Battery Swap', icon: BatteryMedium, screen: 'map', serviceMode: 'swap' },
    { label: 'Reserve', icon: CalendarClock, screen: 'reservation' },
    { label: 'Rewards', icon: Gift, screen: 'rewards' },
  ];

  return (
    <ScreenPad>
      <Header title="Good morning" subtitle="Ready for a cleaner ride?" right={<Bell size={21} />} />

      <section className="mt-5 rounded-[28px] bg-ink p-5 text-white shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/70">Current battery</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-6xl font-black leading-none">68</span>
              <span className="pb-2 text-xl font-bold text-white/80">%</span>
            </div>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-leaf">
            <BatteryCharging size={30} />
          </div>
        </div>
        <div className="mt-5 h-3 rounded-full bg-white/12">
          <div className="h-full w-[68%] rounded-full bg-leaf" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Metric label="Estimated range" value="146 km" />
          <Metric label="CO2 saved today" value="3.4 kg" />
        </div>
      </section>

      <section className="mt-4 rounded-[28px] bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint text-leaf">
            <Bluetooth size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-black">Bike connected</p>
              <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-extrabold text-leaf">Live BMS</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              SOC synced from your smart bike controller via Bluetooth. Last update 12 sec ago.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniStat icon={BatteryMedium} label="Battery ID" value="KH-22A" />
              <MiniStat icon={RefreshCw} label="Sync" value="12 sec" />
            </div>
            <button
              onClick={() => onNavigate('service')}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3 text-xs font-extrabold text-white transition active:scale-[0.98]"
            >
              Bike health and service shops
              <Activity size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.screen, { serviceMode: action.serviceMode })}
            className="rounded-3xl bg-white p-4 text-left shadow-sm transition active:scale-[0.98]"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-leaf">
              <action.icon size={23} />
            </div>
            <p className="mt-4 text-sm font-extrabold">{action.label}</p>
          </button>
        ))}
      </section>

      <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Nearest station</p>
            <h2 className="mt-2 text-xl font-black">{station.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{station.area} • {station.distance}</p>
          </div>
          <span className={`h-3 w-3 rounded-full ${station.statusColor}`} />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <MiniStat icon={PlugZap} label="Chargers" value={station.chargers} />
          <MiniStat icon={Clock3} label="Wait" value={station.wait} />
          <MiniStat
            icon={CircleDollarSign}
            label={station.swap ? 'Swap' : 'kWh'}
            value={station.swap ? station.swapPrice : station.price}
          />
        </div>
        <button
          onClick={onStation}
          className="mt-4 w-full rounded-2xl bg-ink py-3 text-sm font-bold text-white transition active:scale-[0.98]"
        >
          View Station Details
        </button>
      </section>
    </ScreenPad>
  );
}

function MapScreen({ stations, serviceMode, onBack, onStation, onModeChange }) {
  const [activeFilter, setActiveFilter] = useState(serviceMode === 'swap' ? 'Battery Swap' : 'Nearest');
  const visibleStations = activeFilter === 'Battery Swap' ? stations.filter((station) => station.swap) : stations;
  const title = activeFilter === 'Battery Swap' ? 'Find battery swap' : 'Find charging';

  const pickFilter = (filter) => {
    setActiveFilter(filter);
    onModeChange(filter === 'Battery Swap' ? 'swap' : 'charge');
  };

  return (
    <ScreenPad>
      <TopBar title={title} onBack={onBack} />
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => pickFilter(filter)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              activeFilter === filter ? 'bg-ink text-white' : 'bg-white text-slate-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="map-grid relative mt-4 h-[430px] overflow-hidden rounded-[30px] bg-[#dceee5] shadow-sm">
        <div className="road-horizontal top-[22%]" />
        <div className="road-horizontal top-[55%]" />
        <div className="road-horizontal top-[78%]" />
        <div className="road-vertical left-[25%]" />
        <div className="road-vertical left-[62%]" />
        <div className="road-diagonal top-[50%]" />
        <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-xs font-extrabold text-slate-600 shadow-sm">
          Mock Phnom Penh Map
        </div>
        {visibleStations.map((station) => (
          <button
            key={station.id}
            onClick={() => onStation(station)}
            className={`absolute ${station.position} -translate-x-1/2 -translate-y-1/2`}
            aria-label={station.name}
          >
            <span className={`grid h-12 w-12 place-items-center rounded-full border-4 border-white ${station.statusColor} text-white shadow-lg`}>
              <Zap size={22} fill="currentColor" />
            </span>
          </button>
        ))}
      </section>

      <section className="mt-4 space-y-3 pb-20">
        {visibleStations.map((station) => (
          <button
            key={station.id}
            onClick={() => onStation(station)}
            className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-sm"
          >
            <span className={`h-4 w-4 rounded-full ${station.statusColor}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{station.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                {activeFilter === 'Battery Swap'
                  ? `${station.distance} • ${station.swapPrice} per swap • ${station.swapBatteries} batteries`
                  : `${station.distance} • ${station.status} • ${station.wait}`}
              </p>
            </div>
            <MapPin size={20} className="text-leaf" />
          </button>
        ))}
      </section>
    </ScreenPad>
  );
}

function StationDetails({ station, serviceMode, onBack, onReserve }) {
  const isSwapMode = serviceMode === 'swap' && station.swap;

  return (
    <ScreenPad>
      <TopBar title={isSwapMode ? 'Swap details' : 'Station details'} onBack={onBack} />
      <section className="mt-4 overflow-hidden rounded-[30px] bg-ink text-white shadow-soft">
        <div className="relative h-40 bg-[#25372f]">
          <div className="absolute inset-x-8 bottom-8 h-12 rounded-full bg-white/10" />
          <div className="absolute left-7 top-9 grid h-20 w-20 place-items-center rounded-[26px] bg-leaf">
            <PlugZap size={42} />
          </div>
          <div className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink">{station.status}</div>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-black">{station.name}</h1>
          <p className="mt-1 text-sm text-white/65">{station.area} • {station.distance} away</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {isSwapMode ? (
              <>
                <Metric label="Swap batteries" value={station.swapBatteries} />
                <Metric label="Swap time" value={station.swapTime} />
                <Metric label="Price per swap" value={station.swapPrice} />
                <Metric label="Includes check" value="BMS scan" />
              </>
            ) : (
              <>
                <Metric label="Available chargers" value={station.chargers} />
                <Metric label="Waiting time" value={station.wait} />
                <Metric label="Price per kWh" value={station.price} />
                <Metric label="Battery swap" value={station.swap ? station.swapPrice : 'No'} />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Reviews</h2>
          <div className="flex items-center gap-1 rounded-full bg-mint px-3 py-2 text-sm font-bold text-leaf">
            <Star size={16} fill="currentColor" />
            {station.reviews}
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isSwapMode
            ? 'Fast battery handover, clear swap fee, and the staff scans your battery health before exchange.'
            : 'Clean location, clear pricing, and staff helped with the battery swap process.'}
        </p>
      </section>

      <button
        onClick={onReserve}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf py-4 text-base font-bold text-white shadow-lg shadow-green-700/20 transition active:scale-[0.98]"
      >
        {isSwapMode ? 'Reserve Battery Swap' : 'Reserve Now'}
        <CalendarClock size={19} />
      </button>
    </ScreenPad>
  );
}

function ReservationScreen({ station, reservation, onBack, onChange }) {
  const confirmCode = useMemo(() => `EV-${station.id}${reservation.time.replace(':', '')}`, [station.id, reservation.time]);
  const [isPaying, setIsPaying] = useState(false);
  const selectedPayment = paymentMethods.find((method) => method.id === reservation.payment) ?? paymentMethods[0];
  const estimate = getReservationEstimate(station, reservation.type);
  const availableChargeTypes = station.swap ? chargeTypes : chargeTypes.filter((type) => type !== 'Battery Swap');

  const update = (key, value) => onChange((current) => ({ ...current, [key]: value, confirmed: false }));
  const confirmReservation = () => {
    setIsPaying(true);
    window.setTimeout(() => {
      onChange((current) => ({ ...current, confirmed: true }));
      setIsPaying(false);
    }, 900);
  };

  return (
    <ScreenPad>
      <TopBar title="Reserve slot" onBack={onBack} />
      <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Station</p>
        <h1 className="mt-2 text-xl font-black">{station.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {station.distance} • {estimate.serviceLabel}
        </p>
      </section>

      <ChoiceGroup label="Select time" options={timeSlots} value={reservation.time} onPick={(value) => update('time', value)} />
      <ChoiceGroup label="Charging type" options={availableChargeTypes} value={reservation.type} onPick={(value) => update('type', value)} />
      {reservation.type === 'Battery Swap' && (
        <section className="mt-5 rounded-[28px] bg-mint p-5 text-ink shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-leaf text-white">
              <BatteryMedium size={23} />
            </div>
            <div>
              <p className="text-sm font-black">Swap package selected</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Fixed fee per exchange. No kWh charging subtotal.
              </p>
            </div>
          </div>
        </section>
      )}
      <PaymentPanel
        methods={paymentMethods}
        selected={selectedPayment}
        estimate={estimate}
        onPick={(methodId) => update('payment', methodId)}
      />

      <button
        onClick={confirmReservation}
        disabled={isPaying}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf py-4 text-base font-bold text-white shadow-lg shadow-green-700/20 transition active:scale-[0.98] disabled:opacity-70"
      >
        {isPaying ? 'Authorizing payment...' : `Pay ${estimate.deposit} deposit and reserve`}
        {isPaying ? <LoaderCircle size={19} className="animate-spin" /> : <ShieldCheck size={19} />}
      </button>

      {reservation.confirmed && (
        <section className="mt-5 rounded-[30px] bg-ink p-5 text-white shadow-soft">
          <div className="flex items-center gap-2 text-leaf">
            <Check size={20} />
            <p className="font-extrabold">Payment approved</p>
          </div>
          <div className="mt-4 flex items-center gap-5">
            <MockQr />
            <div>
              <p className="text-sm text-white/65">Entry QR</p>
              <p className="mt-1 text-2xl font-black">{confirmCode}</p>
              <p className="mt-3 text-sm text-white/70">{reservation.time} • {reservation.type} • {selectedPayment.label}</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <ReceiptText size={17} />
              Digital receipt
            </div>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <ReceiptRow label="Paid now" value={estimate.deposit} />
              <ReceiptRow label="Estimated total" value={estimate.total} />
              <ReceiptRow label="Payment" value={selectedPayment.account} />
              <ReceiptRow label="Status" value="Authorized" />
            </div>
          </div>
        </section>
      )}
    </ScreenPad>
  );
}

function ChargingProgress({ percent, onBack, onBump, onStop }) {
  const cost = (percent * 0.031).toFixed(2);

  return (
    <ScreenPad>
      <TopBar title="Charging" onBack={onBack} />
      <section className="mt-5 rounded-[32px] bg-ink p-6 text-white shadow-soft">
        <div className="mx-auto grid h-48 w-48 place-items-center rounded-full bg-white/10 p-4">
          <div className="grid h-full w-full place-items-center rounded-full border-[14px] border-leaf bg-[#24362f]">
            <div className="text-center">
              <p className="text-5xl font-black">{percent}%</p>
              <p className="mt-1 text-sm text-white/60">battery</p>
            </div>
          </div>
        </div>
        <div className="mt-7 h-4 rounded-full bg-white/12">
          <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Metric label="Remaining time" value="24 min" />
          <Metric label="Current cost" value={`$${cost}`} />
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={onBump} className="rounded-2xl bg-white py-4 text-sm font-extrabold shadow-sm transition active:scale-[0.98]">
          Simulate +7%
        </button>
        <button onClick={onStop} className="rounded-2xl bg-red-500 py-4 text-sm font-extrabold text-white shadow-sm transition active:scale-[0.98]">
          Stop charging
        </button>
      </div>
    </ScreenPad>
  );
}

function RewardsScreen({ onBack }) {
  return (
    <ScreenPad>
      <TopBar title="Rewards" onBack={onBack} />
      <section className="mt-5 rounded-[30px] bg-leaf p-6 text-white shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/75">Green Points</p>
            <p className="mt-1 text-5xl font-black">2,450</p>
          </div>
          <Trophy size={52} />
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <RewardCard icon={Leaf} title="CO2 saved" value="128 kg" />
        <RewardCard icon={Gift} title="Free charging" value="1 coupon" />
      </div>

      <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-leaf">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="font-black">Monthly EV Challenge</h2>
            <p className="mt-1 text-sm text-slate-500">Complete 8 clean charging sessions.</p>
          </div>
        </div>
        <div className="mt-5 h-3 rounded-full bg-slate-100">
          <div className="h-full w-[62%] rounded-full bg-leaf" />
        </div>
        <p className="mt-3 text-sm font-bold text-slate-600">5 of 8 sessions completed</p>
      </section>
    </ScreenPad>
  );
}

function ServiceScreen({ onBack }) {
  const healthItems = [
    { label: 'Battery health', value: '91%', status: 'Good' },
    { label: 'Motor temp', value: '38°C', status: 'Normal' },
    { label: 'Controller', value: 'OK', status: 'Synced' },
    { label: 'Brake sensor', value: 'Check', status: 'Service soon' },
  ];

  return (
    <ScreenPad>
      <TopBar title="Bike health" onBack={onBack} />

      <section className="mt-5 rounded-[30px] bg-ink p-5 text-white shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/65">Connected bike diagnosis</p>
            <h1 className="mt-2 text-4xl font-black">Healthy</h1>
            <p className="mt-2 text-sm leading-6 text-white/70">
              EV Connect reads BMS and controller data to suggest repair shops before a small issue becomes expensive.
            </p>
          </div>
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-leaf">
            <Activity size={34} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {healthItems.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-white/58">{item.label}</p>
              <p className="mt-1 text-lg font-black">{item.value}</p>
              <p className="mt-1 text-[11px] font-bold text-leaf">{item.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[28px] bg-mint p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-leaf text-white">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black">Recommended fix</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Brake sensor response is slower than usual. Book a nearby repair shop for a quick inspection.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Repair and e-bike shops</h2>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-extrabold text-leaf shadow-sm">Nearby</span>
        </div>
        <div className="mt-3 space-y-3 pb-20">
          {servicePartners.map((shop) => (
            <article key={shop.id} className="rounded-[26px] bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mint text-leaf">
                  <shop.icon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-black">{shop.name}</p>
                      <p className="mt-1 text-xs font-bold text-leaf">{shop.type}</p>
                    </div>
                    <p className="shrink-0 text-xs font-extrabold text-slate-500">{shop.distance}</p>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">{shop.service}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-limewash px-3 py-2 text-xs font-extrabold text-ink">{shop.price}</span>
                    <button className="rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-white">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </ScreenPad>
  );
}

function CommunityReportScreen({ sent, onSent, onBack }) {
  const [rating, setRating] = useState(4);

  return (
    <ScreenPad>
      <TopBar title="Community report" onBack={onBack} />
      <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
        <label className="flex items-center gap-3 rounded-2xl bg-limewash p-4">
          <input type="checkbox" className="h-5 w-5 accent-leaf" />
          <span className="flex items-center gap-2 text-sm font-extrabold"><Wrench size={19} /> Report broken charger</span>
        </label>

        <div className="mt-5">
          <p className="text-sm font-extrabold">Rate station</p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} onClick={() => setRating(value)} className="text-leaf">
                <Star size={30} fill={value <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-extrabold" htmlFor="comment">Add comment</label>
          <textarea
            id="comment"
            rows="5"
            placeholder="Tell other drivers what you noticed..."
            className="mt-3 w-full resize-none rounded-2xl border border-slate-100 bg-limewash p-4 text-sm outline-none focus:border-leaf"
          />
        </div>
      </section>

      <button
        onClick={onSent}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf py-4 text-base font-bold text-white shadow-lg shadow-green-700/20 transition active:scale-[0.98]"
      >
        Submit report
        <Send size={18} />
      </button>

      {sent && (
        <div className="mt-4 rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-white">
          Thanks. Your report helps keep Phnom Penh charging reliable.
        </div>
      )}
    </ScreenPad>
  );
}

function ScreenPad({ children }) {
  return <div className="min-h-full px-5 pb-28 pt-12">{children}</div>;
}

function Header({ title, subtitle, right }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-leaf">EV Connect</p>
        <h1 className="mt-1 text-2xl font-black">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <button className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">{right}</button>
    </header>
  );
}

function TopBar({ title, onBack }) {
  return (
    <header className="flex items-center gap-3">
      <button onClick={onBack} className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm">
        <ChevronLeft size={23} />
      </button>
      <h1 className="text-xl font-black">{title}</h1>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf text-white shadow-lg shadow-green-700/20">
        <PlugZap size={27} />
      </div>
      <div>
        <p className="text-sm font-black leading-4">EV Connect</p>
        <p className="text-xs font-bold text-slate-500">Phnom Penh</p>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-xs text-white/58">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-limewash p-3 text-center">
      <Icon className="mx-auto text-leaf" size={19} />
      <p className="mt-2 text-[11px] font-bold text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function ChoiceGroup({ label, options, value, onPick }) {
  return (
    <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
      <p className="text-sm font-extrabold">{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onPick(option)}
            className={`rounded-2xl px-3 py-3 text-sm font-bold transition ${
              value === option ? 'bg-ink text-white' : 'bg-limewash text-slate-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

function PaymentPanel({ methods, selected, estimate, onPick }) {
  return (
    <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-extrabold">Payment</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Secure reservation deposit</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-mint px-3 py-2 text-xs font-extrabold text-leaf">
          <ShieldCheck size={15} />
          Protected
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onPick(method.id)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
              selected.id === method.id ? 'border-leaf bg-mint' : 'border-slate-100 bg-limewash'
            }`}
          >
            <div className={`grid h-11 w-11 place-items-center rounded-2xl ${
              selected.id === method.id ? 'bg-leaf text-white' : 'bg-white text-leaf'
            }`}>
              <method.icon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black">{method.label}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{method.detail}</p>
            </div>
            <div className={`h-5 w-5 rounded-full border-2 ${
              selected.id === method.id ? 'border-leaf bg-leaf ring-4 ring-green-100' : 'border-slate-300'
            }`}>
              {selected.id === method.id && <Check size={16} className="text-white" />}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-ink p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
              {selected.id === 'aba' ? <QrCode size={20} /> : <ReceiptText size={20} />}
            </div>
            <div>
              <p className="text-sm font-extrabold">{selected.account}</p>
              <p className="mt-1 text-xs text-white/58">{selected.balance}</p>
            </div>
          </div>
          <p className="text-right text-sm font-black">{estimate.deposit}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        {estimate.rows.map((row) => (
          <ReceiptRow key={row.label} label={row.label} value={row.value} dark={false} />
        ))}
        <ReceiptRow label="Reservation deposit" value={estimate.deposit} dark={false} />
        <ReceiptRow label="Service fee" value={estimate.fee} dark={false} />
        <div className="flex items-center justify-between rounded-2xl bg-limewash px-4 py-3">
          <p className="text-sm font-black">Estimated total</p>
          <p className="text-lg font-black text-leaf">{estimate.total}</p>
        </div>
      </div>
    </section>
  );
}

function ReceiptRow({ label, value, dark = true }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className={`text-sm ${dark ? 'text-white/58' : 'text-slate-500'}`}>{label}</p>
      <p className={`text-right text-sm font-extrabold ${dark ? 'text-white' : 'text-ink'}`}>{value}</p>
    </div>
  );
}

function MockQr() {
  return (
    <div className="grid h-24 w-24 shrink-0 grid-cols-7 gap-1 rounded-2xl bg-white p-2">
      {Array.from({ length: 49 }).map((_, index) => (
        <span key={index} className="qr-cell rounded-[2px] bg-slate-100" />
      ))}
    </div>
  );
}

function getReservationEstimate(station, chargeType) {
  if (chargeType === 'Battery Swap') {
    const swapPrice = Number((station.swapPrice ?? '$0').replace('$', ''));
    const deposit = 0.2;
    const fee = 0.05;
    const total = swapPrice + fee;

    return {
      serviceLabel: `${station.swapPrice} per swap`,
      rows: [
        { label: 'Swap package', value: '1 battery exchange' },
        { label: 'Swap subtotal', value: formatUsd(swapPrice) },
        { label: 'Estimated swap time', value: station.swapTime ?? 'N/A' },
      ],
      deposit: formatUsd(deposit),
      fee: formatUsd(fee),
      total: formatUsd(total),
    };
  }

  const pricePerKwh = Number(station.price.replace('$', ''));
  const kwhByType = {
    Normal: 18,
    Fast: 24,
  };
  const kwh = kwhByType[chargeType] ?? 18;
  const subtotal = pricePerKwh * kwh;
  const deposit = 0.5;
  const fee = 0.1;
  const total = subtotal + fee;

  return {
    serviceLabel: `${station.price}/kWh`,
    rows: [
      { label: 'Energy estimate', value: `${kwh} kWh` },
      { label: 'Charging subtotal', value: formatUsd(subtotal) },
    ],
    deposit: formatUsd(deposit),
    fee: formatUsd(fee),
    total: formatUsd(total),
  };
}

function formatUsd(value) {
  return `$${value.toFixed(2)}`;
}

function RewardCard({ icon: Icon, title, value }) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-leaf">
        <Icon size={23} />
      </div>
      <p className="mt-4 text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </section>
  );
}

function BottomNav({ active, onNavigate }) {
  const items = [
    { screen: 'home', icon: Home, label: 'Home' },
    { screen: 'map', icon: MapPin, label: 'Map' },
    { screen: 'progress', icon: Timer, label: 'Charge' },
    { screen: 'rewards', icon: Gift, label: 'Rewards' },
    { screen: 'service', icon: Wrench, label: 'Service' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white/95 px-3 pb-4 pt-3 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`flex h-14 flex-col items-center justify-center rounded-2xl text-[10px] font-extrabold transition ${
              active === item.screen ? 'bg-mint text-leaf' : 'text-slate-400'
            }`}
          >
            <item.icon size={20} />
            <span className="mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default App;
