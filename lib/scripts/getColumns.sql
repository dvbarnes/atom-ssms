SELECT
  [COLUMN_NAME]
  ,[IS_NULLABLE]
  ,[DATA_TYPE]
  ,[CHARACTER_MAXIMUM_LENGTH]
FROM INFORMATION_SCHEMA.COLUMNS
where
TABLE_NAME=@tableName AND TABLE_SCHEMA=@tableSchema
ORDER BY
ORDINAL_POSITION
