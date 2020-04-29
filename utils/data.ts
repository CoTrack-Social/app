export const regions = {
  ar: {
      name: 'Argentina',
      lang: 'es',
      provinces: [
        { id: 1, name: 'Provincia de Buenos Aires', tel: '148' },

        { id: 2, name: 'Catamarca', tel: '383 154238872' },
      
        { id: 3, name: 'Chaco', tel: '0800 444 0829' },
      
        { id: 4, name: 'Chubut', tel: '0800 222 2676' },

        {
          id: 5,
          name: 'Ciudad Autónoma de Buenos Aires',
          tel: '107',
          extra: '11 5050 0147 (whatsapp)',
        },
      
        { id: 6, name: 'Córdoba ', tel: '0800 122 1444' },
      
        {
          id: 7,
          name: 'Corrientes',
          tel: '0379 4974811',
          extra: '379 4895124 (celular)',
        },
      
        { id: 8, name: 'Entre Ríos', tel: '0800 7778476' },
      
        { id: 9, name: 'Formosa', tel: '107' },
      
        { id: 10, name: 'Jujuy', tel: '0800 888 4767' },
      
        {
          id: 11,
          name: 'La Pampa',
          tel: '0800 333 1135',
          extra: '2954 604986 (celular)',
        },
      
        { id: 12, name: 'La Rioja', tel: '107', extra: '911' },
      
        {
          id: 13,
          name: 'Mendoza',
          tel: '0800 800 26843',
          image: require('../assets/images/provinces/Mendoza_province_COA.png'),
        },
      
        {
          id: 14,
          name: 'Misiones',
          tel: '0800 444 3400',
          image: require('../assets/images/provinces/Esc_mis.jpg'),
        },
      
        { id: 15, name: 'Neuquén', tel: '0800 333 1002' },
      
        { id: 16, name: 'Río Negro', tel: '911' },
      
        { id: 17, name: 'Salta', tel: '911' },
      
        { id: 18, name: 'San Luis', tel: '107' },
      
        { id: 19, name: 'San Juan', tel: '107' },
      
        { id: 20, name: 'Santa Cruz', tel: '107' },
      
        { id: 21, name: 'Santa Fe', tel: '0800 555 6549' },
      
        {
          id: 22,
          name: 'Santiago del Estero',
          tel: '0800 8886737',
          image: require('../assets/images/provinces/Escudo_de_la_Provincia_de_Santiago_del_Estero.png'),
        },
      
        {
          id: 23,
          name: 'Tierra del Fuego',
          tel: '107',
        },
      
        {
          id: 24,
          name: 'Tucumán',
          tel: '0800 555 8478',
          extra: '0381 4302228 (lunes a viernes 7 a 17 horas)',
        },
      ]
  },
  it: {
    name: 'Italia',
    lang: 'it',
    provinces: [
      { id: 25, name: 'Municipio 1 - Centro Storico, Trastevere, Aventino', tel: '800118800',
        doctors: [
          {id: 1, name: 'Medico 1 Municipio I', type: 'Specialista Oncologia'},
          {id: 2, name: 'Medico 2 Municipio I', type: 'Specialista Pneumologia'},
          {id: 3, name: 'Medico 3 Municipio I', type: 'Specialista Cariologia'},
        ],
      },
      { 
        id: 26, name: 'Municipio 2 - Villaggio Olimpico, Parioli, Flamini', tel: '800118800',
        doctors: [
          {id: 4, name: 'Medico 1 Municipio II', type: 'Specialista Pneumologia'}
        ],
      },
    
      { id: 27, name: 'Municipio 3 - Montesacro, Val Melaina, Monte Sacro', tel: '800118800' ,
      doctors: [
        {id: 5, name: 'Medico 1 Municipio III', type: 'Specialista Cardiologia'}
      ] , 
      },
    
      { id: 28, name: 'Municipio 4 - Casal Bertone, Casal Bruciato', tel: '800118800',
      doctors: [
        {id: 6, name: 'Medico 1 Municipio IV', type: 'Specialista Epatologia'}
      ] 
      },
    
      {
        id: 29,
        name: 'Municipio 5 - Torpignattara, Casilino, Quadraro',
        tel: '800118800',
        extra: '11 5050 0147 (whatsapp)',
        doctors: [
          {id: 7, name: 'Medico 1 Municipio V', type: 'Specialista Ortopedia'}
        ],
      },
    
      { id: 30, name: 'Municipio 6 - Torre Spaccata, Torre Maura, Giardin', tel: '800894545',
        doctors: [
        {id: 8, name: 'Medico 1 Municipio VI', type: 'Specialista Otorinolaringoiatria'}
        ],
      },
    
      {
        id: 31,
        name: 'Municipio 7 - Tuscolano Nord, Tuscolano Sud',
        tel: '800894545',
        doctors: [
          {id: 9, name: 'Medico 1 Municipio VII', type: 'Specialista Ginecologia'}
        ],
      },
      { id: 32, name: 'Municipio 8 - Ostiense, Valco San Paolo, Garbatell', tel: '800894545',
        doctors: [
          {id: 10, name: 'Medico 1 Municipio VIII', type: 'Specialista Pediatria'}
        ],
      },
      { id: 33, name: 'Municipio 9 - Eur, Villaggio Giuliano, Torrino', tel: '800894545', 
        doctors: [
          {id: 11, name: 'Medico 1 Municipio IX', type: 'Specialista Neurologia'}
        ],
      },
      { id: 34, name: 'Municipio 10 - Malafede, Acilia Nord, Acilia Sud', tel: '800894545' },
      { id: 35, name: 'Municipio 11 - Marconi, Portuense, Pian due Torri', tel: '800894545' },
      { id: 36, name: 'Municipio 12 - Colli Portuensi, Buon Pastore', tel: '800894545' },
      { id: 37, name: 'Municipio 13 - Aurelio Sud, Val Cannuta, Fogaccia', tel: '800894545' },
      { id: 38, name: 'Municipio 14 - Medaglie d\'Oro, Primavalle, Ottavia', tel: '800894545' },
      { id: 39, name: 'Municipio 15 - Tor di Quinto, Acquatraversa, Tomba', tel: '800894545' },
      { id: 40, name: 'Rieti', tel: '800894545' },
      { id: 41, name: 'Provincia di Roma', tel: '800894545' },
      { id: 42, name: 'Frosinone', tel: '800894545' },
      { id: 43, name: 'Latina', tel: '800894545' },
      { id: 44, name: 'Viterbo', tel: '800894545' },
      
    ]
  }
}

export const provinces = [
  { id: 1, name: 'Provincia de Buenos Aires', tel: '148' },

  { id: 2, name: 'Catamarca', tel: '383 154238872' },

  { id: 3, name: 'Chaco', tel: '0800 444 0829' },

  { id: 4, name: 'Chubut', tel: '0800 222 2676' },

  {
    id: 5,
    name: 'Ciudad Autónoma de Buenos Aires',
    tel: '107',
    extra: '11 5050 0147 (whatsapp)',
  },

  { id: 6, name: 'Córdoba ', tel: '0800 122 1444' },

  {
    id: 7,
    name: 'Corrientes',
    tel: '0379 4974811',
    extra: '379 4895124 (celular)',
  },

  { id: 8, name: 'Entre Ríos', tel: '0800 7778476' },

  { id: 9, name: 'Formosa', tel: '107' },

  { id: 10, name: 'Jujuy', tel: '0800 888 4767' },

  {
    id: 11,
    name: 'La Pampa',
    tel: '0800 333 1135',
    extra: '2954 604986 (celular)',
  },

  { id: 12, name: 'La Rioja', tel: '107', extra: '911' },

  {
    id: 13,
    name: 'Mendoza',
    tel: '0800 800 26843',
    image: require('../assets/images/provinces/Mendoza_province_COA.png'),
  },

  {
    id: 14,
    name: 'Misiones',
    tel: '0800 444 3400',
    image: require('../assets/images/provinces/Esc_mis.jpg'),
  },

  { id: 15, name: 'Neuquén', tel: '0800 333 1002' },

  { id: 16, name: 'Río Negro', tel: '911' },

  { id: 17, name: 'Salta', tel: '911' },

  { id: 18, name: 'San Luis', tel: '107' },

  { id: 19, name: 'San Juan', tel: '107' },

  { id: 20, name: 'Santa Cruz', tel: '107' },

  { id: 21, name: 'Santa Fe', tel: '0800 555 6549' },

  {
    id: 22,
    name: 'Santiago del Estero',
    tel: '0800 8886737',
    image: require('../assets/images/provinces/Escudo_de_la_Provincia_de_Santiago_del_Estero.png'),
  },

  {
    id: 23,
    name: 'Tierra del Fuego',
    tel: '107',
  },

  {
    id: 24,
    name: 'Tucumán',
    tel: '0800 555 8478',
    extra: '0381 4302228 (lunes a viernes 7 a 17 horas)',
  },
];
