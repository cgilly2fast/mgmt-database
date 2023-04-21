
export type UnitsType = {
  guest_info_type: string;
  active: boolean;
  address?: {
    apartment?: String
    city?: String
    coordinates?: {
      _lat: string
      _long: string
    }
    country?: string
    display?: string
    number?: string
    postcode?: string
    state?: string
    street?: string
  }
  amenities_list: string
  capacity: capacity
  check_in: string
  check_out: string
  cleaningf_ee: number
  currency: string
  description: string
  faq: string
  guidebook_url: string
  hospitable_id: number
  house_manaul?: string
  id: string
  listing_settings?: string
  listings?: listings
  name: string
  neighborhood: string
  office: string
  owner: owner
  photos_archive: string
  picture: picture[]
  property_type: boolean
  remit_taxes: string
  rent: string
  room_type: string
  send_guest_info: boolean
  tax_rate: string
  timezone: string
  title: string
  unit_folder: string
  wifi: string
  wifi_password: string
};

export type capacity = {
  bathrooms?: number
  bedrooms?: number
  beds?: number
  max?: number
}

export type listings = {
  [key: string]: airbnb;
}

export type airbnb = {
  active: boolean
  id: string
  picture: string
  provider: string
  public_name: string
  remit_taxes: boolean
  url: string
}

export type owner = {
  [key: string]: owners;
}

export type owners = {
  email: string
  first_name: string
  last_name: string
  phone: string
  picture: string
  uuid: string
}

export type picture = {
  "240X160": string
  "320X213": string
  "480X320": string
  "720X480": string
  "960X640": string
  "1200X800": string
  isCurrent: boolean
  location: string
  original: string
}

export type amenitiesType = {
  available: boolean
  name: string
  notes: string
  url: string
}

export type OwnerType = {
  last_name: string;
  first_name: string;
  uuid: string;
  active: boolean;
  address?: {
    apartment?: String
    city?: String
    coordinates?: {
      _lat: string
      _long: string
    }
    country?: string
    display?: string
    number?: string
    postcode?: string
    state?: string
    street?: string
  }
  airbnb_username: string
  company_name: string
  email: string
  id: string
  mgmt_take_cleaning_fee: boolean
  owner_statements: boolean
  partnership: boolean
  pay_tax: boolean
  phone: string
  picture: string
  units?: units
  vrbo_username: string
  xero_id: string
  business_number: string
  business_pin: string
  tot_account: string
  tot_pin: string
  percentage: string
}
export type units = {
  [key: string]: unitss;
}

export type unitss = {
  id: string
  name: string
  picture: string
  xero_id: string
}

export type unreadmessgetype = {
  guest: {
    first_name: string
    last_name: string
    picture: string
  }
  id: string
  last_message: {
    content: string
    created_at: any
    isRead: boolean
    user_id: string
  }
}

export type Allmessagestype = {
  guest: {
    first_name: string
    last_name: string
    picture: string
  }
  id: string
  last_message: {
    content: string
    created_at: any
    isRead: boolean
    user_id: string
  }
}

export type threadByIdtype = {
  guest: {
    first_name: string
    last_name: string
    picture: string
  }
  id: string
  last_message: {
    content: string
    created_at: any
    isRead: boolean
    user_id: string
  }
}

export type threadMessagetype = {
  content: string
  created_at: any
  isRead: boolean
  user_id: string
}

export type teamtype = {
  active: boolean;
  address?: {
    apartment?: String
    city?: String
    coordinates?: {
      _lat: string
      _long: string
    }
    country?: string
    display?: string
    number?: string
    postcode?: string
    state?: string
    street?: string
  }
  email: string
  first_name: string
  hours_sheet: string
  id: string
  last_name: string
  payment_nickname: string
  payment_type: string
  phone: string
  picture: string
  position: string
}

export type rulesListtype = {
  active: boolean
  days: string
  exclude_last_minute_stays: boolean
  greater_than_2_night_stays: boolean
  hours: string
  id: string
  immediately: boolean
  message: string
  minutes: string
  name: string
  one_night_stays: boolean
  trigger_on: string
  two_night_stays: boolean
  type: string
  units?: any
}

export type rulesListtypes = {
  [key: string]: rulesListtype;
}

export type listMessagetype = {
  map(arg0: (item: listMessagetype) => JSX.Element): import("react").ReactNode;
  icon: string
  name: string
  short_type: string
  type: string
}

export type propertiesListtype = {
  name: string
  units: any
}

export type ruleDetailtype = {
  active?: boolean
  days?: string
  exclude_last_minute_stays?: boolean
  greater_than_2_night_stays?: boolean
  hours?: string
  immediately?: string
  message?: string
  minutes?: string
  name?: string
  one_night_stays?: boolean
  trigger_on?: string
  two_night_stays?: boolean
  type?: string
  units?: any
}

