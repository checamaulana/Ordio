export type OrderVariant = {
    id: number;
    variant_group_name: string;
    variant_option_name: string;
    additional_price: number;
};

export type OrderItem = {
    id: number;
    menu_item_name: string;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    subtotal: number;
    note: string | null;
    variants: OrderVariant[];
};

export type DashboardOrder = {
    id: number;
    order_number: string;
    order_type: 'dine_in' | 'takeaway';
    table_number: number | null;
    status: 'diproses' | 'selesai';
    payment_status: 'belum_bayar' | 'menunggu_konfirmasi' | 'sudah_bayar';
    payment_method: 'cash' | 'qris';
    subtotal: number;
    discount_total: number;
    tax_amount: number;
    total: number;
    cash_received: number | null;
    cash_change: number | null;
    created_at: string | null;
    items: OrderItem[];
};

export type OrdersPollingResponse = {
    orders: DashboardOrder[];
    server_time: string;
};
