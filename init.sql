-- Active l'extension pour les UUID si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: health_centers
CREATE TABLE health_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('hospital', 'clinic', 'pharmacy', 'health_post', 'distributor', 'manufacturer')),
    license_number VARCHAR(255) UNIQUE,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL DEFAULT 'Sénégal',
    postal_code VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(255),
    email VARCHAR(255),
    website VARCHAR(255),
    director_name VARCHAR(255),
    director_phone VARCHAR(255),
    director_email VARCHAR(255),
    capacity_beds INTEGER CHECK (capacity_beds >= 0),
    services_offered JSONB DEFAULT '[]'::jsonb,
    operating_hours JSONB DEFAULT '{}'::jsonb,
    emergency_contact VARCHAR(255),
    storage_capacity INTEGER DEFAULT 1000,
    cold_storage_available BOOLEAN DEFAULT false,
    cold_storage_capacity INTEGER DEFAULT 0,
    certification_status VARCHAR(50) DEFAULT 'pending' CHECK (certification_status IN ('pending', 'certified', 'suspended', 'revoked')),
    certification_date TIMESTAMP WITH TIME ZONE,
    certification_expiry TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    hedera_account_id VARCHAR(255) UNIQUE,
    last_inspection_date TIMESTAMP WITH TIME ZONE,
    next_inspection_date TIMESTAMP WITH TIME ZONE,
    compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour health_centers
CREATE INDEX health_centers_name_idx ON health_centers(name);
CREATE INDEX health_centers_type_idx ON health_centers(type);
CREATE INDEX health_centers_city_idx ON health_centers(city);
CREATE INDEX health_centers_region_idx ON health_centers(region);
CREATE INDEX health_centers_license_number_idx ON health_centers(license_number);
CREATE INDEX health_centers_certification_status_idx ON health_centers(certification_status);

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    password VARCHAR(255) NOT NULL CHECK (length(password) >= 6 AND length(password) <= 100),
    first_name VARCHAR(50) NOT NULL CHECK (length(first_name) >= 2 AND length(first_name) <= 50),
    last_name VARCHAR(50) NOT NULL CHECK (length(last_name) >= 2 AND length(last_name) <= 50),
    phone VARCHAR(255) CHECK (phone ~ '^[+]?[0-9\s\-\(\)]+$'),
    role VARCHAR(50) NOT NULL DEFAULT 'patient' CHECK (role IN ('admin', 'pharmacist', 'doctor', 'patient', 'manufacturer', 'distributor')),
    health_center_id UUID REFERENCES health_centers(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    profile_picture VARCHAR(255),
    hedera_account_id VARCHAR(255) UNIQUE,
    verification_token VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: medicines
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
    generic_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('antibiotics', 'analgesics', 'vaccines', 'antimalarials', 'cardiovascular', 'diabetes', 'respiratory', 'other')),
    dosage_form VARCHAR(50) NOT NULL CHECK (dosage_form IN ('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops')),
    strength VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    description TEXT,
    side_effects TEXT,
    contraindications TEXT,
    storage_conditions VARCHAR(255),
    therapeutic_class VARCHAR(255),
    atc_code VARCHAR(255),
    price_per_unit DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'XOF',
    requires_prescription BOOLEAN DEFAULT false,
    is_controlled_substance BOOLEAN DEFAULT false,
    minimum_stock_level INTEGER DEFAULT 10,
    maximum_stock_level INTEGER DEFAULT 1000,
    image_url VARCHAR(255),
    barcode VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour medicines
CREATE INDEX medicines_name_idx ON medicines(name);
CREATE INDEX medicines_generic_name_idx ON medicines(generic_name);
CREATE INDEX medicines_manufacturer_idx ON medicines(manufacturer);
CREATE INDEX medicines_category_idx ON medicines(category);
CREATE INDEX medicines_barcode_idx ON medicines(barcode);

-- Table: batches
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number VARCHAR(255) NOT NULL UNIQUE,
    medicine_id UUID NOT NULL REFERENCES medicines(id),
    manufacturing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    quantity_manufactured INTEGER NOT NULL CHECK (quantity_manufactured >= 1),
    quantity_remaining INTEGER NOT NULL CHECK (quantity_remaining >= 0),
    unit_cost DECIMAL(10,2) NOT NULL,
    manufacturing_location VARCHAR(255),
    quality_control_status VARCHAR(50) DEFAULT 'pending' CHECK (quality_control_status IN ('pending', 'passed', 'failed', 'recalled')),
    quality_control_date TIMESTAMP WITH TIME ZONE,
    quality_control_notes TEXT,
    hedera_token_id VARCHAR(255) UNIQUE,
    hedera_nft_serial VARCHAR(255),
    blockchain_hash VARCHAR(255),
    qr_code TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'recalled', 'depleted')),
    recall_reason TEXT,
    recall_date TIMESTAMP WITH TIME ZONE,
    temperature_log JSONB DEFAULT '[]'::jsonb,
    humidity_log JSONB DEFAULT '[]'::jsonb,
    gps_coordinates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour batches
CREATE INDEX batches_batch_number_idx ON batches(batch_number);
CREATE INDEX batches_medicine_id_idx ON batches(medicine_id);
CREATE INDEX batches_expiry_date_idx ON batches(expiry_date);
CREATE INDEX batches_status_idx ON batches(status);
CREATE INDEX batches_hedera_token_id_idx ON batches(hedera_token_id);

-- Table: transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    batch_id UUID REFERENCES batches(id),
    from_center_id UUID REFERENCES health_centers(id),
    to_center_id UUID REFERENCES health_centers(id),
    quantity INTEGER NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    transaction_type VARCHAR(50) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    blockchain_tx_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: stocks
CREATE TABLE stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID NOT NULL REFERENCES medicines(id),
    batch_id UUID NOT NULL REFERENCES batches(id),
    health_center_id UUID NOT NULL REFERENCES health_centers(id),
    quantity INTEGER NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: iot_devices
CREATE TABLE iot_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_center_id UUID NOT NULL REFERENCES health_centers(id),
    device_type VARCHAR(50) NOT NULL,
    device_id VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    last_reading TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_center_id UUID REFERENCES health_centers(id),
    medicine_id UUID REFERENCES medicines(id),
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES users(id),
    health_center_id UUID REFERENCES health_centers(id),
    report_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_path VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);