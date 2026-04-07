<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case BelumBayar = 'belum_bayar';
    case MenungguKonfirmasi = 'menunggu_konfirmasi';
    case SudahBayar = 'sudah_bayar';
}
