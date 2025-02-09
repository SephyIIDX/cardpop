from operator import itemgetter

# Read card data from rom
CARD_DATA_START_OFFSET = 0x5C430
CARD_DATA_END_OFFSET = 0x62A6A
with open("baserom.gbc", "rb") as file:
    file.seek(CARD_DATA_START_OFFSET)
    card_data_bytes = file.read(CARD_DATA_END_OFFSET - CARD_DATA_START_OFFSET)

# Card data offsets
CARD_DATA_TYPE = 0x00
CARD_DATA_RARITY = 0x05
CARD_DATA_SET = 0x07
CARD_DATA_ID_LOW = 0x08
CARD_DATA_ID_HIGH = 0x09

PKMN_CARD_DATA_LENGTH = 0x42
NON_PKMN_CARD_DATA_LENGTH = 0x10  # Energy or Trainer

card_data = []

remaining_bytes = card_data_bytes
while len(remaining_bytes) > 0:
    card_type = remaining_bytes[CARD_DATA_TYPE]

    if card_type <= 6:
        # It's a pokemon
        card_bytes = remaining_bytes[:PKMN_CARD_DATA_LENGTH]
    else:
        # It's an energy or trainer
        card_bytes = remaining_bytes[:NON_PKMN_CARD_DATA_LENGTH]
    print(card_bytes.hex())

    card_id = (card_bytes[CARD_DATA_ID_HIGH] << 8) | card_bytes[CARD_DATA_ID_LOW]
    card_data.append(
        {
            "id": card_id,
            "rarity": card_bytes[CARD_DATA_RARITY],
            "set": card_bytes[CARD_DATA_SET],
        }
    )

    remaining_bytes = remaining_bytes[len(card_bytes) :]

card_data.sort(key=itemgetter("id"))

# Print card data as javascript list
print("const cardData = [")
for card in card_data:
    print(
        f'\t{{ "id": {hex(card['id'])}, "rarity": {hex(card['rarity'])}, "set": {hex(card['set'])} }},'
    )
print("];")
