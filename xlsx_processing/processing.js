const xlsx = require("xlsx");

function cargarArchivoXLSX(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const headers = ["Nombre", "Edad", "Nums"];

  const data = xlsx.utils.sheet_to_json(worksheet, {
    header: headers,
    range: 1,
    defval: null,
  });

  const errors = [];
  const MAX_ROWS = 20000;

  if (data.length > MAX_ROWS) {
    errors.push({
      fila: 0,
      columna: "",
      mensaje: `El archivo no puede tener más de ${MAX_ROWS} filas.`,
    });
    return { data: [], errors };
  }

  const newData = data.map((row, rowIndex) => {
    const validatedRow = {};

    for (const [columnName, value] of Object.entries(row)) {
      const columnIndex = headers.indexOf(columnName) + 1;

      if (columnName === "Nombre") {
        const validationErrors = validateString(
          value,
          rowIndex + 1,
          columnName
        );
        if (validationErrors.length > 0) {
          // Log errores
          validatedRow[columnName] = null;
          errors.push(...validationErrors);
        } else {
          validatedRow[columnName] = value;
        }
      } else if (columnName === "Edad") {
        const validationErrors = validateNumber(
          value,
          rowIndex + 1,
          columnName
        );
        if (validationErrors.length > 0) {
          // Log errores
          validatedRow[columnName] = null;
          errors.push(...validationErrors);
        } else {
          validatedRow[columnName] = Number(value);
        }
      } else if (columnName === "Nums") {
        const validationErrors = validateNums(value, rowIndex + 1, columnName);
        if (validationErrors.length > 0) {
          // Log errores
          validatedRow[columnName] = null;
          errors.push(...validationErrors);
        } else {
          // Realizar el split solo si el valor contiene el carácter ','
          const nums = String(value).includes(',') ? value.split(',').map(num => Number(num.trim())) : [Number(String(value).trim())];

          validatedRow[columnName] = nums;
        }
      }
    }

    return validatedRow;
  });
  return { "data": newData, "errores": errors };
}

function validateString(value, rowNumber, column) {
  if (typeof value !== "string" || value.trim() === "") {
    return [
      {
        columna: column,
        fila: rowNumber + 1,
        mensaje: `El campo ${column} debe ser una cadena no vacía.`,
      },
    ];
  }

  if (!/^[a-zA-Z\s]+$/.test(value)) {
    return [
      {
        columna: column,
        fila: rowNumber + 1,
        mensaje: `El campo ${column} debe contener solo nombres válidos.`,
      },
    ];
  }

  return [];
}

function validateNumber(value, rowNumber, column) {
  if (typeof value !== "number" || isNaN(value)) {
    return [
      {
        columna: column,
        fila: rowNumber + 1,
        mensaje: `El campo ${column} debe ser un número válido.`,
      },
    ];
  }

  return [];
}

function validateNums(value, rowNumber, column) {
    // Eliminar espacios en blanco del valor
    const strippedValue = String(value).replace(/\s+/g, '');
  
    // Verificar si el valor cumple con el formato de un solo número o números separados por comas
    if (!/^(\d+(\s*,\s*\d+)*)?$/.test(strippedValue)) {
      return [{
        fila: rowNumber,
        columna: column,
        mensaje: `El campo ${column} debe contener solo números divididos por comas o un número válido.`,
      }];
    }
  
    // Verificar si el valor contiene al menos un dígito
    if (/\d/.test(strippedValue)) {
      // Dividir los números por comas y mapearlos a tipo numérico
      const nums = strippedValue.split(',').map((num) => {
        const parsedNum = Number(num.trim());
        return isNaN(parsedNum) ? null : parsedNum;
      });
  
      // Verificar si la cantidad de números excede el límite permitido
      if (nums.length > 5000) {
        return [{
          fila: rowNumber,
          columna: column,
          mensaje: `El campo ${column} no debe contener más de 5000 números.`,
        }];
      }
  
      // Retornar un arreglo vacío en caso de que los números sean válidos
      return [];
    }
  
    // Retornar un arreglo vacío si el valor no contiene dígitos (caso de un solo número)
    return [];
  }
  
module.exports = cargarArchivoXLSX;