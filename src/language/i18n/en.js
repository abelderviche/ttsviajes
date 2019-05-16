const RESOURCES = {
  BRANCHES: 'Sucursales',
  PHONE: '0810-222-1727',
  CONTACT_TIMES: 'Lun a Vier 9 a 19hs. Sáb y Dom 10 a 19hs',
  FLIGHTS: 'Vuelos',
  HOTELS: 'Hoteles',
  PACKAGES: 'Paquetes',
  CARS: 'Autos',
  CRUISES: 'Cruceros',
  REWARDS: 'HSBC Rewards',
  SEARCH_BOX: {
    DATE: 'Fecha',
    DATES: 'Fechas',
    TIME: 'Hora',
    BUTTON: 'Buscar',
    FLIGHTS_TITLE: 'Buscá tu vuelo',
    ADULTS: 'Adultos',
    CHILDREN: 'Niños',
    UNDERAGED: 'Menores',
    PASSENGER_STRING: ({adults, children}) => `${adults} ${adults > 1 ? 'Adultos' : 'Adulto'}${children > 0 ? ` - ${children} ${children > 1 ? 'Menores' : 'Menor'}` : ''}`,
    ONEWAY: 'Solo ida',
    ROUNDTRIP: 'Ida y vuelta',
    MULTIPLE_DESTINATIONS: 'Múltiples destinos',
    FLEXIBLE_DATES: 'Fechas Flexibles',
    DONE: 'Listo',
    ADVANCED_OPTIONS: 'Opciones Avanzadas',
    LEG: 'Tramo',
    ADD_LEG: 'Agregar tramo',
    DEPARTURE: 'Ida',
    RETURNING: 'Vuelta',
    // Hotels
    HOTELS_TITLE: 'Buscá tu hotel',
    PAY_AT_DESTINATION: 'Pago en destino',
    DESTINATION: 'Destino',
    DESTINATION_PLACEHOLDER: 'Ingresá una ciudad',
    ROOMS: 'Habitaciones',
    ROOM: 'Habitación',
    ROOMS_STRING: ({rooms}) => `${rooms} ${rooms > 1 ? `Habitaciones` : `Habitación`}`,
    CHILDREN_AGE: ({i}) => `${i === 0 ? 'Hasta 1 año' : i}`,
    ADD_ROOM: 'Sumar habitación',
    // Packages
    PACKAGES_TITLE: 'Paquetes',
    // Cars
    CARS_TITLE: 'Alquilá tu auto',
    RETURN_DIFF_CITY: 'Devolver en otro destino',
    PICKUP: 'Retiro',
    DROPOFF: 'Devolución',
    CITY_OR_AIRPORT: 'Ingresá ciudad o aeropuerto'
  }
};

export default RESOURCES;
