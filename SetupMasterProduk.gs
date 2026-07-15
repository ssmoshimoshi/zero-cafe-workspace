function api_populateMasterProduk() {
  try {
    var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('ZERO_CAFE_SPREADSHEET_ID') || SpreadsheetApp.getActiveSpreadsheet().getId());
    
    var sheet = ss.getSheetByName("Master_Produk");
    if (!sheet) {
      sheet = ss.insertSheet("Master_Produk");
    } else {
      sheet.clear();
    }
    
    var headers = ["ID", "Kategori", "Nama Produk", "Harga", "Status"];
    var data = [headers];
    
    var exceptions = ["Espresso", "Americano Tropical", "Americano Dark Cherry", "Americano Frambozen", "Americano Frambosen"];
    
    var minumanBase = [
      "Coffee Milk", "Coffee ZERO", "Cappucino", "Cafe Latte", "Caramel Macchiato", "Caramel Salted", 
      "Caramel Coffee", "Butterscooth", "Butterscooth Seasalt", "Koper (Kopi Perjuangan)", "Susu Creamy Coffee", 
      "Cocopandan Coffee", "Espresso", "Americano", "Americano Tropical", "Americano Dark Cherry", "Americano Frambozen",
      "Taro", "Red Velvet", "Strawberry Milk", "White Zero", "Caramel Aren Milk", "Strawberry Mojito", "Lychee Mojito",
      "Regal Aren coffee", "Regal Aren Original", "Regal Vanilla Milk", "Matcha Greentea", "Matcha Pure Latte", 
      "Matcha Pistachio", "Lemon Tea", "Strawberry tea", "Lychee Tea", "Milk Tea", "Green Tea", "Thai Tea", 
      "Avocado Tea", "Greentea Non Milk", "Thaitea Non Milk", "Blacktea Non Milk", "Chocolate", "Chocolate Pistachio", 
      "Chocolate Banana", "Chocolate Black Forest", "Chocolate Seasalt", "Chocolate Cream Cheese"
    ];
    
    var counter = 1;
    function addRow(kat, nama) {
      var id = "MNU-" + ("000" + counter).slice(-3);
      data.push([id, kat, nama, 0, "Aktif"]);
      counter++;
    }
    
    for (var i = 0; i < minumanBase.length; i++) {
      var name = minumanBase[i];
      // Jika merupakan exception, tidak diberi akhiran Ice/Hot
      if (exceptions.indexOf(name) !== -1) {
        addRow("Minuman", name);
      } else {
        addRow("Minuman", name + " Ice");
        addRow("Minuman", name + " Hot");
      }
    }
    
    var makanan = [
      "Ayam Saos BBQ", "Ayam Saos Lada Hitam", "Ayam Katsu", "Ayam Sambal Matah", "Ayam Salted Egg", "Paru Rica",
      "Ayam Sereh", "Nasi Goreng Ayam", "Nasi Goreng Seafood", "Mie Goreng ZERO", "Mie Soto ZERO"
    ];
    for (var j = 0; j < makanan.length; j++) {
      addRow("Makanan", makanan[j]);
    }
    
    var snack = [
      "Pisang Goreng Coklat Keju", "Pisang Goreng Gula Merah", "Pisang Goreng Original", "Pisang Goreng Keju", "Pisang Goreng Coklat",
      "Roti Bakar Keju", "Roti Bakar Coklat", "Roti Bakar Coklat Keju", "Sandwich", "French Fries", "Tahu Walik"
    ];
    for (var k = 0; k < snack.length; k++) {
      addRow("Snack", snack[k]);
    }
    
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    
    // Format headers
    sheet.getRange(1, 1, 1, data[0].length).setFontWeight("bold").setBackground("#f3f3f3");
    
    SpreadsheetApp.getUi().alert("Berhasil!", "Berhasil mengisi " + (data.length - 1) + " produk ke Master_Produk sesuai spesifikasi PDF.", SpreadsheetApp.getUi().ButtonSet.OK);
    return {success: true, message: "Berhasil mengisi " + (data.length - 1) + " produk."};
  } catch(e) {
    if (SpreadsheetApp.getUi) SpreadsheetApp.getUi().alert("Gagal", e.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
    return {success: false, message: e.toString()};
  }
}
