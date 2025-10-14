import sqlite3


def delete_table(db_path: str, table_name: str):
    """
    Deletes a table from the SQLite database.

    Args:
        db_path (str): Path to the SQLite database file.
        table_name (str): Name of the table to be deleted.
    """
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute(f"DROP TABLE IF EXISTS {table_name}")
    conn.commit()
    conn.close()


def create_db_and_insert(json_data, db_path):
    """
    Create SQLite DB, table, and insert JSON data.

    Args:
        json_data (list): List of dictionaries with emotion-song info.
        db_path (str): Path to the SQLite database file.
    """

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Create table for emotion songs
    cur.execute("""
        CREATE TABLE IF NOT EXISTS emotion_songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emotion TEXT NOT NULL,
            song_title TEXT NOT NULL,
            youtube_url TEXT NOT NULL,
            song_line TEXT NOT NULL,
            language TEXT NOT NULL DEFAULT 'en'
        )
    """)

    # Prepare list of tuples for bulk insert
    records = [
        (item["emotion"], item["song_title"], item["youtube_url"], item["song_line"],item["language"])
        for item in json_data
    ]

    # Bulk insert all records
    cur.executemany(
        """
        INSERT INTO emotion_songs (emotion, song_title, youtube_url, song_line, language)
        VALUES (?, ?, ?, ?, ?)
    """,
        records,
    )

    conn.commit()
    conn.close()

def append_to_db(json_data, db_path):
    """
    Append new records to the existing SQLite DB table.

    Args:
        json_data (list): List of dictionaries with emotion-song info.
        db_path (str): Path to the SQLite database file.
    """
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Prepare list of tuples for bulk insert
    records = [
        (item["emotion"], item["song_title"], item["youtube_url"], item["song_line"], item.get("language", "en"))
        for item in json_data
    ]

    # Bulk insert all records
    cur.executemany(
        """
        INSERT INTO emotion_songs (emotion, song_title, youtube_url, song_line, language)
        VALUES (?, ?, ?, ?, ?)
    """,
        records,
    )

    conn.commit()
    conn.close() 


# Example Usage:
json_data_en = [
    {
        "emotion": "happy",
        "song_title": "Happy - Pharrell Williams",
        "youtube_url": "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
        "song_line": "Because I'm happy Clap along if you feel like happiness is the truth",
        "language": "en"
    },
    {
        "emotion": "happy",
        "song_title": "Can't Stop the Feeling! - Justin Timberlake",
        "youtube_url": "https://www.youtube.com/watch?v=ru0K8uYEZWw",
        "song_line": "I got that sunshine in my pocket, got that good song in my feet",
        "language": "en"
    },
    {
        "emotion": "happy",
        "song_title": "Uptown Funk - Mark Ronson ft. Bruno Mars",
        "youtube_url": "https://www.youtube.com/watch?v=OPf0YbXqDm0",
        "song_line": "Don't believe me just watch",
        "language": "en"
    },
    {
        "emotion": "happy",
        "song_title": "Good Vibrations - The Beach Boys",
        "youtube_url": "https://www.youtube.com/watch?v=UtrLgxQx7Yw",
        "song_line": "I'm picking up good vibrations",
        "language": "en"
    },
    {
        "emotion": "happy",
        "song_title": "Walking on Sunshine - Katrina & The Waves",
        "youtube_url": "https://www.youtube.com/watch?v=iPUmE-tne5U",
        "song_line": "I'm walking on sunshine, whoa",
        "language": "en"
    },
    {
        "emotion": "happy",
        "song_title": "Best Day of My Life - American Authors",
        "youtube_url": "https://www.youtube.com/watch?v=Y66j_BUCBMY",
        "song_line": "This is gonna be the best day of my life",
        "language": "en"
    },
    {
        "emotion": "sad",
        "song_title": "Someone Like You - Adele",
        "youtube_url": "https://www.youtube.com/watch?v=hLQl3WQQoQ0",
        "song_line": "Never mind I'll find someone like you",
        "language": "en"
    },
    {
        "emotion": "sad",
        "song_title": "Fix You - Coldplay",
        "youtube_url": "https://www.youtube.com/watch?v=k4V3Mo61fJM",
        "song_line": "Lights will guide you home and ignite your bones",
        "language": "en"
    },
    {
        "emotion": "sad",
        "song_title": "Hurt - Johnny Cash",
        "youtube_url": "https://www.youtube.com/watch?v=8AHCfZTRGiI",
        "song_line": "I hurt myself today to see if I still feel",
        "language": "en"
    },
    {
        "emotion": "sad",
        "song_title": "Everybody Hurts - R.E.M.",
        "youtube_url": "https://www.youtube.com/watch?v=ijZRCIrTgQc",
        "song_line": "When your day is long and the night, the night is yours alone",
        "language": "en"
    },
    {
        "emotion": "sad",
        "song_title": "The Night We Met - Lord Huron",
        "youtube_url": "https://www.youtube.com/watch?v=KtlgYxa6BMU",
        "song_line": "I had all and then most of you, some and now none of you",
        "language": "en"
    },
    {
        "emotion": "angry",
        "song_title": "Break Stuff - Limp Bizkit",
        "youtube_url": "https://www.youtube.com/watch?v=ZpUYjpKg9KY",
        "song_line": "It's just one of those days where you don't wanna wake up",
        "language": "en"
    },
    {
        "emotion": "angry",
        "song_title": "Killing in the Name - Rage Against The Machine",
        "youtube_url": "https://www.youtube.com/watch?v=bWXazVhlyxQ",
        "song_line": "Some of those that work forces, are the same that burn crosses",
        "language": "en"
    },
    {
        "emotion": "angry",
        "song_title": "You Oughta Know - Alanis Morissette",
        "youtube_url": "https://www.youtube.com/watch?v=NPcyTyilmYY",
        "song_line": "And every time I scratch my nails down someone else's back",
        "language": "en"
    },
    {
        "emotion": "angry",
        "song_title": "Du Hast - Rammstein",
        "youtube_url": "https://www.youtube.com/watch?v=W3q8Od5qJio",
        "song_line": "Du hast mich gefragt, du hast mich gefragt",
        "language": "en"
    },
    {
        "emotion": "angry",
        "song_title": "Fighter - Christina Aguilera",
        "youtube_url": "https://www.youtube.com/watch?v=PstrAfoMKlc",
        "song_line": "Made me learn a little bit stronger",
        "language": "en"
    },
    {
        "emotion": "surprise",
        "song_title": "Surprise Yourself - Jack Garratt",
        "youtube_url": "https://www.youtube.com/watch?v=nyEbB0YijZQ",
        "song_line": "I wanna surprise myself",
        "language": "en"
    },
    {
        "emotion": "surprise",
        "song_title": "What a Wonderful World - Louis Armstrong",
        "youtube_url": "https://www.youtube.com/watch?v=CWzrABouyeE",
        "song_line": "I see trees of green, red roses too",
        "language": "en"
    },
    {
        "emotion": "surprise",
        "song_title": "Bohemian Like You - The Dandy Warhols",
        "youtube_url": "https://www.youtube.com/watch?v=eda1w-BPx6I",
        "song_line": "I've got a girlfriend and I love her, yeah yeah",
        "language": "en"
    },
    {
        "emotion": "surprise",
        "song_title": "Closer to the Edge - 30 Seconds to Mars",
        "youtube_url": "https://www.youtube.com/watch?v=I_izvAbhExY",
        "song_line": "We live, we love, we lie",
        "language": "en"
    },
    {
        "emotion": "surprise",
        "song_title": "Here Comes the Sun - The Beatles",
        "youtube_url": "https://www.youtube.com/watch?v=KQetemT1sWc",
        "song_line": "Here comes the sun, and I say it's all right",
        "language": "en"
    },
    {
        "emotion": "disgust",
        "song_title": "Creep - Radiohead",
        "youtube_url": "https://www.youtube.com/watch?v=XFkzRNyygfk",
        "song_line": "I'm a creep, I'm a weirdo",
        "language": "en"
    },
    {
        "emotion": "disgust",
        "song_title": "Toxic - Britney Spears",
        "youtube_url": "https://www.youtube.com/watch?v=LOZuxwVk7TU",
        "song_line": "With a taste of your lips I'm on a ride",
        "language": "en"
    },
    {
        "emotion": "disgust",
        "song_title": "Bad Guy - Billie Eilish",
        "youtube_url": "https://www.youtube.com/watch?v=DyDfgMOUjCI",
        "song_line": "So you're a tough guy, like it really rough guy",
        "language": "en"
    },
    {
        "emotion": "disgust",
        "song_title": "Smells Like Teen Spirit - Nirvana",
        "youtube_url": "https://www.youtube.com/watch?v=hTWKbfoikeg",
        "song_line": "With the lights out, it's less dangerous",
        "language": "en"
    },
    {
        "emotion": "disgust",
        "song_title": "Ran - Aimee Mann",
        "youtube_url": "https://www.youtube.com/watch?v=7BUoIejdwmg",
        "song_line": "But I don't want to go",
        "language": "en"
    },
    {
        "emotion": "fear",
        "song_title": "Thriller - Michael Jackson",
        "youtube_url": "https://www.youtube.com/watch?v=sOnqjkJTMaA",
        "song_line": "'Cause this is thriller, thriller night",
        "language": "en"
    },
    {
        "emotion": "fear",
        "song_title": "Disturbia - Rihanna",
        "youtube_url": "https://www.youtube.com/watch?v=E1mU6h4Xdxc",
        "song_line": "Bum-bum-be-dum, bum-bum-be-dum, be-dum, be-dum",
        "language": "en"
    },
    {
        "emotion": "fear",
        "song_title": "Fear of the Dark - Iron Maiden",
        "youtube_url": "https://www.youtube.com/watch?v=J0S91fXfHfI",
        "song_line": "Have you run your fingers down the wall",
        "language": "en"
    },
    {
        "emotion": "fear",
        "song_title": "Somebody's Watching Me - Rockwell",
        "youtube_url": "https://www.youtube.com/watch?v=LU6mTEomtHk",
        "song_line": "I'm just an average man with an average life",
        "language": "en"
    },
    {
        "emotion": "fear",
        "song_title": "Creep - Radiohead",
        "youtube_url": "https://www.youtube.com/watch?v=XFkzRNyygfk",
        "song_line": "I'm a creep, I'm a weirdo",
        "language": "en"
    },
    {
        "emotion": "neutral",
        "song_title": "Let It Be - The Beatles",
        "youtube_url": "https://www.youtube.com/watch?v=QDYfEBY9NM4",
        "song_line": "And when the broken-hearted people living in the world agree, there will be an answer, let it be",
        "language": "en"
    },
    {
        "emotion": "neutral",
        "song_title": "Everybody's Got to Learn Sometime - The Korgis",
        "youtube_url": "https://www.youtube.com/watch?v=oFRPc9vxmvo",
        "song_line": "Change your heart, look around you",
        "language": "en"
    },
    {
        "emotion": "neutral",
        "song_title": "Stand by Me - Ben E. King",
        "youtube_url": "https://www.youtube.com/watch?v=hwZNL7QVJjE",
        "song_line": "No, I won't be afraid, oh, I won't be afraid",
        "language": "en"
    },
    {
        "emotion": "neutral",
        "song_title": "Waiting on the World to Change - John Mayer",
        "youtube_url": "https://www.youtube.com/watch?v=wRLWHKOl5PA",
        "song_line": "It's hard to beat the system when we're standing at a distance",
        "language": "en"
    },
    {
        "emotion": "neutral",
        "song_title": "Breathe Me - Sia",
        "youtube_url": "https://www.youtube.com/watch?v=SFGvmrJ5rjM",
        "song_line": "Help, I have done it again",
        "language": "en"
    }
]

json_data_ka = [
    {
        "emotion": "sad",
        "song_title": "Banigondu",
        "youtube_url": "https://youtu.be/PUEBih5-Nu4?si=7wM3dNHBle01DQ-S",
        "song_line": "Baanigondu elle ellide ninnasegelli kone ide",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Elliruve",
        "youtube_url": "https://youtu.be/aV1kJ_XG84w?si=5EaBYWw9ZJv9CrOW",
        "song_line": "Elliruve ninna nenapu nannolage iruvenu",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Ravivarmana",
        "youtube_url": "https://youtu.be/NN1vW40MDUc?si=hVzCouiCb6n6jV3A",
        "song_line": "Ravivarmana chitramelaliruva nanna kanasina baavane",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Jeeva Hoovagide",
        "youtube_url": "https://youtu.be/eDEGxCmbTvY?si=qen57DxFTDoLuBBX",
        "song_line": "Jeeva hoovagide, ninna preetige aagide",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Karedaru Kelade",
        "youtube_url": "https://youtu.be/lb1VQNn3bAQ?si=RPwptsiTuyAovxI7",
        "song_line": "Karedaru kelade bandenu ninna manege",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Naguva Nayana",
        "youtube_url": "https://youtu.be/AJSeaFthdeE?si=dgVy5YdP99CTTdjw",
        "song_line": "Naguva nayana nanna cheluvina modave",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Navaduva Nudiye",
        "youtube_url": "https://youtu.be/R3ogWZ_VBx0?si=fvWO_wi08UUtZ-rf",
        "song_line": "Navaduva nudiye ninna hesaru",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Onde Usiranthe",
        "youtube_url": "https://youtu.be/XyjPmxlzaPY?si=cB-8wm1VjGOpHTAY",
        "song_line": "Onde usiranthe naavu iruvenu",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Noorondu Nenapu",
        "youtube_url": "https://youtu.be/bBBCapSUoFE?si=-cfp3OHAw2puc5U4",
        "song_line": "Noorondu nenapu ninna smarane",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Manikya Veena",
        "youtube_url": "https://youtu.be/B7wmb8xfrAw?si=ZGocKqZv7bksV1ge",
        "song_line": "Manikya veena mookajjiya manege",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Ninnindale",
        "youtube_url": "https://youtu.be/euKf7CN04wU?si=m4PvliZedxjhzNGk",
        "song_line": "Ninnindale ninna hesarinda bandide nanna jeevana",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Ninna Kanda",
        "youtube_url": "https://youtu.be/dbxUw6yJjKY?si=vCFiNJ4beGgL2QKi",
        "song_line": "Ninna kanda nanna manasu biddu hode",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Hoovina Banadanthe",
        "youtube_url": "https://youtu.be/8nsxHEiW7Lg?si=9i4MoJv7080q4D7K",
        "song_line": "Hoovina banadanthe ninna naguvige nanna preeti",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Anisuthide",
        "youtube_url": "https://youtu.be/uchdYcbq7Ys?si=uv2HYQkeS2pDTiFC",
        "song_line": "Anisuthide ninna hesarinda naaniruve",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Ninna Nodalentho",
        "youtube_url": "https://youtu.be/Pb32oy8UGY0?si=56xmugB7qzI-zYnd",
        "song_line": "Ninna nodalento ninna maretukoledenu",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Ninna Poojege Bande",
        "youtube_url": "https://youtu.be/thwtc8waa7U?si=CaiOcxIU9DtEcgn",
        "song_line": "Ninna poojege bande bhakthi nindida manadinda",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Yendu Kanda Kanasu",
        "youtube_url": "https://youtu.be/A7t2AL-X5VQ?si=1q6gk13ZgtfkIMxq",
        "song_line": "Yendu kanda kanasu, ninna nenapu mareyalaare",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Bangle Bangari",
        "youtube_url": "https://youtu.be/ckbWXG97W10?si=y4Ugs3fzmZKxmBKQ",
        "song_line": "Bangle bangari, preetiyu rangoli",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Mayavi",
        "youtube_url": "https://youtu.be/TMY1g8pAktk?si=g4e3-pBPl2mEwhgc",
        "song_line": "Mayavi ninna nodi manasu santosha",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Belakina Kavithe",
        "youtube_url": "https://youtu.be/N7C24ZtXykg?si=WiW9Ucci1Fz3LkFe",
        "song_line": "Belakina kavithe, preetiya bayalu",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Kadalanu",
        "youtube_url": "https://youtu.be/i_vRoQGIc6Y?si=UXgFjeHsRP0-ZOLE",
        "song_line": "Kadalanu ninna olavina thale",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Innunu Bekagide",
        "youtube_url": "https://youtu.be/fclPhO1FsOY?si=KeAy2CBz_LOegQsj",
        "song_line": "Innunu bekagide ninna naguvige",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "SSE Title Track",
        "youtube_url": "https://youtu.be/dDMXyQ6cwIc?si=Kian2XMcJkdiSLla",
        "song_line": "SSE title, jeevanadalli hosadanthe",
        "language": "ka"
    },
    {
        "emotion": "surprise",
        "song_title": "Nange Allava",
        "youtube_url": "https://youtu.be/RVMnT4nq9NU?si=Zqw4Bhov4E9WXsKV",
        "song_line": "Nange allava, idella preetiya maya",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Singara Siriye",
        "youtube_url": "https://youtu.be/3XShkcOze3s?si=M2SGnRbOL0P47Uz0",
        "song_line": "Singara siriye, ninna naguvige nanna hrudaya",
        "language": "ka"
    },
    {
        "emotion": "angry",
        "song_title": "Varaha Roopam",
        "youtube_url": "https://youtu.be/m-5ck3BuT1o?si=4y0v7RMFg97MNmhc",
        "song_line": "Varaha roopam, daivada shakti",
        "language": "ka"
    },
    {
        "emotion": "happy",
        "song_title": "Bramhakalasha",
        "youtube_url": "https://youtu.be/palMj0iq-3g?si=gr7dRHQxvmt2izN4",
        "song_line": "Bramhakalasha, utsavada dhwani",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Yeno Yeno Aagide",
        "youtube_url": "https://youtu.be/sWk9lpkGAfs?si=JkhAc1eGMdIc882W",
        "song_line": "Yeno yeno aagide, ninna nenapalli",
        "language": "ka"
    },
    {
        "emotion": "sad",
        "song_title": "Saaluthillave",
        "youtube_url": "https://youtu.be/8iCcyOekVpc?si=lyCNBITAT2h91ihR",
        "song_line": "Saaluthillave, ninna preetiya maduve",
        "language": "ka"
    },
    {
        "emotion": "surprise",
        "song_title": "Chandra Chooda",
        "youtube_url": "https://youtu.be/F_aL1IGzCSo?si=_P1EIEkye68U-trz",
        "song_line": "Chandra chooda shiva shankara mahadeva",
        "language": "ka"
    }
]

json_data_hi = [
    {
        "emotion": "sad",
        "song_title": "Mere Mehboob Qayamat Hogi",
        "youtube_url": "https://youtu.be/yIzCBU0_LyY?si=V5WlXN2flwEkzN8T",
        "song_line": "Mere mehboob qayamat hogi, aaj ruswa teri galiyon mein mohabbat hogi",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Deewana Hua",
        "youtube_url": "https://youtu.be/NOPVgnD2WGk?si=CcXvBFaPAE-kyKoU",
        "song_line": "Deewana hua badal, sawan ki ghata chhayi, dekho zara dekho, barsaat aayi",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Badan Pe Sitare",
        "youtube_url": "https://youtu.be/MkABeVCv4lw?si=PMsGJS3F4higig9q",
        "song_line": "Badan pe sitare lapete hue, o jaane tamanna kidhar ja rahi ho",
        "language": "hi"
    },
    {
        "emotion": "sad",
        "song_title": "Yeh Dil Tum Bin Kahin Lagta Nahi",
        "youtube_url": "https://youtu.be/UbrJ0QmAxiQ?si=T0eygCSva7TRFr4d",
        "song_line": "Yeh dil tum bin kahin lagta nahi, hum kya karein",
        "language": "hi"
    },
    {
        "emotion": "sad",
        "song_title": "Lag Ja Gale",
        "youtube_url": "https://youtu.be/DFbbpMD3taw?si=HVB47DXFV1cv0mRj",
        "song_line": "Lag ja gale ke phir yeh haseen raat ho na ho, shayad phir is janam mein mulaqat ho na ho",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Dekha Ek Khwab",
        "youtube_url": "https://youtu.be/7dO_MS9tZ5E?si=17D-SudXJ1GyYkN7",
        "song_line": "Dekha ek khwab to yeh silsile hue, door tak nigahon mein hain gul khile hue",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Tere Mere Beech Mein",
        "youtube_url": "https://youtu.be/oGKDBhdxn6c?si=leYM5tC6tiMvOAWP",
        "song_line": "Tere mere beech mein kaisa hai ye bandhan, anjaana sa ye bandhan hai",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Haal Kaisa Hai Janab Ka",
        "youtube_url": "https://youtu.be/bFPDaDoruTY?si=JoZ5Ic40-7Y3Wz1y",
        "song_line": "Haal kaisa hai janab ka, kya khayal hai aapka",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Kisi Ke Muskurahaton Pe",
        "youtube_url": "https://youtu.be/69pPYkGiEAQ?si=ZAD7qaxI34evLEqS",
        "song_line": "Kisi ke muskurahaton pe ho nisaar, kisi ka dard mil sake to le udhaar",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Abhi Na Jao Chhodkar",
        "youtube_url": "https://youtu.be/mfEQgoVi7P4?si=bQPjweYtmc5APW-h",
        "song_line": "Abhi na jao chhodkar, ke dil abhi bhara nahi",
        "language": "hi"
    },
    {
        "emotion": "romantic",
        "song_title": "Tum Se Hi",
        "youtube_url": "https://youtu.be/mt9xg0mmt28?si=JDEJNXccXoHuSB08",
        "song_line": "Tum se hi din hota hai, surmayi shaam aati hai",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Kajra Re",
        "youtube_url": "https://youtu.be/4dsFQFCvVGU?si=QhniYtjhcZhYgsu1",
        "song_line": "Kajra re kajra re, tere kare kare naina",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Aankhein Khuli Ho Ya Ho Bandh",
        "youtube_url": "https://youtu.be/eM8Mjuq4MwQ?si=KTYhuaRh3tilmkNV",
        "song_line": "Aankhein khuli ho ya ho bandh, deedar wohi milta hai",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Aisa Des Hai Mera",
        "youtube_url": "https://youtu.be/wDheWYmNEhQ?si=onc3KcWEsWnwX6XX",
        "song_line": "Aisa des hai mera, jahan rangon ka mela",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Crazy Kiya Re",
        "youtube_url": "https://youtu.be/J2Bh68GTUOU?si=pFV7dDB1UggcEgBT",
        "song_line": "Crazy kiya re, crazy kiya re, dil choraya tere pyaar mein",
        "language": "hi"
    },
    {
        "emotion": "romantic",
        "song_title": "Khuda Jaane",
        "youtube_url": "https://youtu.be/cmMiyZaSELo?si=vvpb0vpRDztgF1yU",
        "song_line": "Khuda jaane ke main fida hoon, khuda jaane main mit gaya",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Behti Hawa Sa Tha Woh",
        "youtube_url": "https://youtu.be/ewvddSUEONQ?si=zTMmgAeZNfVeIt8E",
        "song_line": "Behti hawa sa tha woh, udti patang sa tha woh, kahan gaya use dhoondo",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Galti Se Mistake",
        "youtube_url": "https://youtu.be/05TA9jNnCdU?si=IE-Mb4pe6325AJSE",
        "song_line": "Galti se mistake ho gaya, chhoti chhoti baaton mein dostiyan badi ho gayi",
        "language": "hi"
    },
    {
        "emotion": "sad",
        "song_title": "Woh Din Bhi Kya Din The",
        "youtube_url": "https://youtu.be/xC1cj9zhh6k?si=53cghWaer6xb2I3",
        "song_line": "Woh din bhi kya din the, hum bhi kitne rangeen the",
        "language": "hi"
    },
    {
        "emotion": "sad",
        "song_title": "Dhun",
        "youtube_url": "https://youtu.be/cUmUOb7j3dc?si=A6iV0TvmyFofToJK",
        "song_line": "Dil dhun dhun dhun kare, dhadkan yeh keh rahi",
        "language": "hi"
    },
    {
        "emotion": "sad",
        "song_title": "Kal Ho Na Ho",
        "youtube_url": "https://youtu.be/g0eO74UmRBs?si=8eefiCp3QU0PmuCH",
        "song_line": "Kal ho na ho, har ghadi badal rahi hai roop zindagi",
        "language": "hi"
    },
    {
        "emotion": "sad",
        "song_title": "Saiyaara",
        "youtube_url": "https://youtu.be/BSJa1UytM8w?si=wYAzjj0ITlCHZP_h",
        "song_line": "Saiyaara main saiyaara, dono jahan se juda",
        "language": "hi"
    },
    {
        "emotion": "happy",
        "song_title": "Kholo Kholo",
        "youtube_url": "https://youtu.be/FIaUYKLg5S4?si=0qWlqzLDSvVHdYcX",
        "song_line": "Kholo kholo darwaze, khidkiyan kholo, hai hawa kuch keh rahi",
        "language": "hi"
    },
    {
        "emotion": "sad",
        "song_title": "Maa",
        "youtube_url": "https://youtu.be/pOK08cRwE6c?si=fUwft7YqXEZrhup_",
        "song_line": "Maa, meri maa, pyari maa, mummy maa",
        "language": "hi"
    },
    {
        "emotion": "surprise",
        "song_title": "Zinda",
        "youtube_url": "https://youtu.be/Ax0G_P2dSBw?si=Xh7UgFz1kthTI4rn",
        "song_line": "Zinda hai toh, pyaala poora bhar le, zindagi ka le maza",
        "language": "hi"
    }
]

if __name__ == "__main__":
    # delete_table("DB/emotion_songs.sqlite", "emotion_songs")
    create_db_and_insert(json_data_en, "DB/emotion_songs.sqlite")
    append_to_db(json_data_ka, "DB/emotion_songs.sqlite")
    append_to_db(json_data_hi, "DB/emotion_songs.sqlite")
