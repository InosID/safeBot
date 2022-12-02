exports.checkPrefix = (prefix, body) => {
  if (!body) return false
  if (typeof prefix == "string") {
    return {
      match: body.startsWith(prefix),
      prefix: prefix,
      body: body.replace(prefix, "")
    }
  } else if (typeof prefix == "object") {
    if (Array.isArray(prefix)) {
      for (const value of prefix) {
        if (typeof value == "string") {
          if (body.startsWith(value)) return {
            match: true,
            prefix: value,
            body: body.replace(value, "")
          }
        } else if (typeof value == "object") {
          if (value instanceof RegExp) {
            if (body.match(value)) return {
              match: true,
              prefix: (value.exec(body))?.[0],
              body: body.replace(value, "")
            }
          }
        }
      }
    } else if (prefix instanceof RegExp) {
      if (body.match(prefix)) return {
        match: true,
        prefix: (prefix.exec(body))?.[0],
        body: body.replace(prefix, "")
      }
    }
  }
  return false
}
