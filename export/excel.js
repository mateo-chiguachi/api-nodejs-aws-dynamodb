const xl = require("excel4node");

const getExcel = async (data) => {
  try {

    const wb = await new xl.Workbook();
    const ws = wb.addWorksheet('Sheet 1');

    const style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12,
      }
    });
     
    ws.cell(1, 1)
      .string('name')
      .style(style)
      .style({font: {size: 15}});
    
    ws.cell(1, 2)
      .string('alias')
      .style(style)
      .style({font: {size: 15}});
    
    ws.cell(1, 3)
      .string('species')
      .style(style)
      .style({font: {size: 15}});
    
    ws.cell(1, 4)
      .string('company_name')
      .style(style)
      .style({font: {size: 15}});
    
    ws.cell(1, 5)
      .string('company_team')
      .style(style)
      .style({font: {size: 15}});

    var c = 2;

    for(var i = 0; i < data.Items.length; i++){
       
       ws.cell(c+i, 1)
       .string(data.Items[i].name)
       .style(style)
       .style({font: {size: 10}});
       ws.cell(c+i, 2)
       .string(data.Items[i].alias)
       .style(style)
       .style({font: {size: 10}});
       ws.cell(c+i, 3)
       .string(data.Items[i].species)
       .style(style)
       .style({font: {size: 10}});
       ws.cell(c+i, 4)
       .string(data.Items[i].company.name)
       .style(style)
       .style({font: {size: 10}});
       ws.cell(c+i, 5)
       .string(data.Items[i].company.team)
       .style(style)
       .style({font: {size: 10}});
    }

    wb.write('./Excel.xlsx');
    
    return ws;

  } catch (error) {
    console.error(error);
  }
};

module.exports = getExcel;
