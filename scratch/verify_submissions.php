<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;

echo "--- Testing Contact Submission ---\n";
$contactData = [
    'name' => 'Test User ' . rand(100, 999),
    'email' => 'test' . rand(100, 999) . '@example.com',
    'message' => 'This is a test message from automated verification.'
];

$response = Http::post('http://localhost:8000/api/contacts', $contactData);
echo "Status: " . $response->status() . "\n";
echo "Response: " . $response->body() . "\n\n";

echo "--- Testing Prescription Submission ---\n";
$presData = [
    'name' => 'Patient ' . rand(100, 999),
    'phone' => '+212600000000',
    'product_id' => null,
    'od_sph' => '-1.50',
    'od_cyl' => '0.00',
    'od_axis' => '180',
    'og_sph' => '-1.25',
    'og_cyl' => '-0.25',
    'og_axis' => '10'
];

$response = Http::post('http://localhost:8000/api/prescriptions', $presData);
echo "Status: " . $response->status() . "\n";
echo "Response: " . $response->body() . "\n\n";

echo "--- Current Database Counts ---\n";
echo 'Contact: ' . \App\Models\Contact::count() . "\n";
echo 'Prescription: ' . \App\Models\Prescription::count() . "\n";
