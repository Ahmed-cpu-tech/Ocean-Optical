<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Contact;
use App\Models\Prescription;

echo 'Contacts count: ' . Contact::count() . "\n";
echo 'Prescriptions count: ' . Prescription::count() . "\n";

foreach (Contact::latest()->take(2)->get() as $contact) {
    echo "Contact: {$contact->name} - {$contact->email}\n";
}

foreach (Prescription::latest()->take(2)->get() as $pres) {
    echo "Prescription: {$pres->name} - {$pres->phone}\n";
}
