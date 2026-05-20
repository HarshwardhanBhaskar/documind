import os

path = r"c:\Users\hwbha\c++ code\neurodocs\components\DashboardPreview.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Sidebar closing tag
content = content.replace(
    ")}\n                                    </div>\n                                ))}",
    ")}\n                                    </Link>\n                                ))}"
)
content = content.replace(
    ")}\r\n                                    </div>\r\n                                ))}",
    ")}\r\n                                    </Link>\r\n                                ))}"
)

# Fix 2: Upload button
content = content.replace(
    """<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"\n                                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>\n                                            + Upload\n                                        </div>""",
    """<Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"\n                                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>\n                                            + Upload\n                                        </Link>"""
)
content = content.replace(
    """<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"\r\n                                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>\r\n                                            + Upload\r\n                                        </div>""",
    """<Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"\r\n                                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>\r\n                                            + Upload\r\n                                        </Link>"""
)

# Fix 3: File list mapping
content = content.replace("<div key={f.name}", "<Link href=\"/dashboard\" key={f.name}")
content = content.replace(
    "shrink-0\" />\n                                            </div>\n                                        ))}",
    "shrink-0\" />\n                                            </Link>\n                                        ))}"
)
content = content.replace(
    "shrink-0\" />\r\n                                            </div>\r\n                                        ))}",
    "shrink-0\" />\r\n                                            </Link>\r\n                                        ))}"
)

with open(path, "w", encoding="utf-8", newline='') as f:
    f.write(content)

print("DashboardPreview patched successfully.")
