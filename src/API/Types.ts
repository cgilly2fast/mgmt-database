export type UnitsType = {
  guest_info_type: string;
  active: boolean;
  address?: {
    apartment?: String;
    city?: String;
    coordinates?: {
      _lat: string;
      _long: string;
    };
    country?: string;
    display?: string;
    number?: string;
    postcode?: string;
    state?: string;
    street?: string;
  };
  amenities_list: string;
  capacity: capacity;
  check_in: string;
  check_out: string;
  cleaningf_ee: number;
  currency: string;
  description: string;
  faq: string;
  guidebook_url: string;
  hospitable_id: number;
  house_manaul?: string;
  id: string;
  listing_settings?: string;
  listings?: listings;
  name: string;
  neighborhood: string;
  office: string;
  owner: owner;
  photos_archive: string;
  picture: picture[];
  property_type: boolean;
  remit_taxes: string;
  rent: string;
  room_type: string;
  send_guest_info: boolean;
  tax_rate: string;
  timezone: string;
  title: string;
  unit_folder: string;
  wifi: string;
  wifi_password: string;
};

export type capacity = {
  bathrooms?: number;
  bedrooms?: number;
  beds?: number;
  max?: number;
};

export type listings = {
  [key: string]: airbnb;
};

export type airbnb = {
  active: boolean;
  id: string;
  picture: string;
  provider: string;
  public_name: string;
  remit_taxes: boolean;
  url: string;
};

export type owner = {
  [key: string]: owners;
};

export type owners = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  picture: string;
  uuid: string;
};

export type picture = {
  "240X160": string;
  "320X213": string;
  "480X320": string;
  "720X480": string;
  "960X640": string;
  "1200X800": string;
  isCurrent: boolean;
  location: string;
  original: string;
};

export type amenitiesType = {
  available: boolean;
  name: string;
  notes: string;
  url: string;
};

export type OwnerType = {
  last_name: string;
  first_name: string;
  uuid: string;
  active: boolean;
  address?: {
    apartment?: String;
    city?: String;
    coordinates?: {
      _lat: string;
      _long: string;
    };
    country?: string;
    display?: string;
    number?: string;
    postcode?: string;
    state?: string;
    street?: string;
  };
  airbnb_username: string;
  company_name: string;
  email: string;
  id: string;
  mgmt_take_cleaning_fee: boolean;
  owner_statements: boolean;
  partnership: boolean;
  pay_tax: boolean;
  phone: string;
  picture: string;
  units?: units;
  vrbo_username: string;
  xero_id: string;
  business_number: string;
  business_pin: string;
  tot_account: string;
  tot_pin: string;
  percentage: string;
};
export type units = {
  [key: string]: unitss;
};

export type unitss = {
  id: string;
  name: string;
  picture: string;
  xero_id: string;
};

export type unreadmessgetype = {
  guest: {
    first_name: string;
    last_name: string;
    picture: string;
  };
  id: string;
  last_message: {
    content: string;
    created_at: any;
    isRead: boolean;
    user_id: string;
  };
};

export type Allmessagestype = {
  guest: {
    first_name: string;
    last_name: string;
    picture: string;
  };
  id: string;
  last_message: {
    content: string;
    created_at: any;
    isRead: boolean;
    user_id: string;
  };
};

export type threadByIdtype = {
  guest: {
    first_name: string;
    last_name: string;
    picture: string;
  };
  id: string;
  last_message: {
    content: string;
    created_at: any;
    isRead: boolean;
    user_id: string;
  };
};

export type threadMessagetype = {
  content: string;
  created_at: any;
  isRead: boolean;
  user_id: string;
};

export type teamtype = {
  uuid: string;
  active: boolean;
  address?: {
    apartment?: String;
    city?: String;
    coordinates?: {
      _lat: string;
      _long: string;
    };
    country?: string;
    display?: string;
    number?: string;
    postcode?: string;
    state?: string;
    street?: string;
  };
  email: string;
  first_name: string;
  hours_sheet: string;
  id: string;
  last_name: string;
  payment_nickname: string;
  payment_type: string;
  phone: string;
  picture: string;
  position: string;
};

export type rulesListtype = {
  active: boolean;
  days: string;
  exclude_last_minute_stays: boolean;
  greater_than_2_night_stays: boolean;
  hours: string;
  id: string;
  immediately: boolean;
  message: string;
  minutes: string;
  name: string;
  one_night_stays: boolean;
  trigger_on: string;
  two_night_stays: boolean;
  type: string;
  units?: any;
};

export type rulesListtypes = {
  [key: string]: rulesListtype;
};

export type listMessagetype = {
  map(arg0: (item: listMessagetype) => JSX.Element): import("react").ReactNode;
  icon: string;
  name: string;
  short_type: string;
  type: string;
};

export type propertiesListtype = {
  name: string;
  units: any;
};

export type ruleDetailtype = {
  active?: boolean;
  days?: string;
  exclude_last_minute_stays?: boolean;
  greater_than_2_night_stays?: boolean;
  hours?: string;
  immediately?: string;
  message?: string;
  minutes?: string;
  name?: string;
  one_night_stays?: boolean;
  trigger_on?: string;
  two_night_stays?: boolean;
  type?: string;
  units?: any;
};

export type accountListtype = {
  account?: string;
  account_id?: string;
  id?: string;
  platform?: string;
  short_code?: string;
  status?: string;
  type?: string;
};

export type ArulesListtype = {
  mirror_invoice: any;
  mirror_account: any;
  account?: {
    account?: string;
    account_id?: string;
    id?: string;
    platform?: string;
    short_code?: string;
  };
  billable?: boolean;
  commission_rate?: string;
  email_receipt?: boolean;
  filter?: boolean;
  id?: string;
  invoice?: {
    contact?: {
      contact_id?: string;
      name?: string;
      xero_id: string;
    };
    currency?: string;
    date?: string;
    due_date?: string;
    line_items?: {
      account_code?: number;
      description?: string;
      quantity?: number;
      tracking?: any;
      unit_amount?: string;
    };
    reference?: string;
    type?: string;
  };
  mirror?: string;
  source_data?: string;
  source_data_type?: string;
  status?: string;
  type?: string;
  units_billable?: any;
  units_filter?: any;
};

export type messagetype = {
  color: string;
  responseMessage: string;
};

export type typeValue = {
  type: string;
};

export type unitValue = {
  account_code: string;
  bill_to: string;
  unit_id: string;
  unit_name: string;
};

export type filterValue = {
  unit_id: string;
  unit_name: string;
};

export type sourceDataTypeValue = {
  source_data_type: string;
};

export type statusValue = {
  status: string;
};

export type connectionValue = {
  account: string;
  account_id: string;
  connection_id: string;
  platfrom: undefined | string;
};

export type invoiceTypeValue = {
  type: string;
};

export type mirrorInvoiceTypeValue = {
  type?: string;
  contact?: {
    contact_id?: string;
    contact_name?: string;
  };
  currency?: string;
  date?: string;
  due_date?: string;
  reference?: string;
  line_items?: {
    account_code?: string;
    description?: string;
    quantity?: string;
    unit_amount?: string;
    tracking?: [
      {
        name?: string;
        option?: string;
      }
    ];
  };
};

export type RuleHistorytype = {
  color: string;
  responseMessage: string;
};

export type syncListtype = {
  created_at: any;
  id: string;
  invoices?: [
    {
      account_id: string;
      created_at: string;
      description: string;
      invoice_id: string;
      url: string;
    }
  ];
  mirror_invoices: any;
  rule_id: string;
  status: string;
  status_details: string;
};

export type listOfCitytype = {
  TMK: string;
  address: string;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
};

export type eventsListtype = {
  date: string;
  day: number;
  min_stay: number;
  price?: {
    amount: number;
    currency: string;
  };
  reservation?: {
    first_name: string;
    last_name: string;
    picture: string;
    reservation_id: string;
  };
  status?: {
    available: boolean;
    note: string;
    reason: string;
  };
};

export type postsItemstype = {
  date?: string;
  extendedProps?: {
    date?: string;
    value?: {
      date?: string;
      day?: number;
      min_stay?: number;
    };
    price?: {
      amount?: number;
      currency?: string;
    };
    reservation?: {
      first_name?: string;
      last_name?: string;
      picture?: string;
      reservation_id?: string;
    };
    status?: {
      available?: boolean;
      note?: string;
      reason?: string;
    };
  };
  title?: string;
  type?: string;
};

export type reservationItemstype = {
  backgroundColor?: string;
  borderColor?: string;
  end?: string;
  extendedProps?: {
    picture?: string;
    value?: {
      date?: string;
      day?: number;
      end_date?: string;
      min_stay?: number;
      price?: {
        amount?: number;
        currency?: string;
      };
      reservation?: {
        first_name?: string;
        last_name?: string;
        picture?: string;
        provider?: string
        reservation_id?: string;
      };
      start_date?: string
      status?: {
        available?: boolean;
        note?: string;
        reason?: string;
      };
    };
    id: string
    start: string
    textColor: string
    title: string
    type: string
  };
};

export type reservationListtype = {
  date: string
  day: number
  end_date: string
  min_stay: number
  price?: {
    amount: number
    currency: string
  }
  reservation?: {
    first_name: string
    last_name: string
    picture: string
    provider: string
    reservation_id: string
  }
  start_date: string
  status?: {
    available: boolean
    note: string
    reason: string
  }
}